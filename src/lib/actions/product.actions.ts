"use server";

import { and, eq, inArray, ne } from "drizzle-orm";

import db from "@/db";
import {
  media,
  product as dbProduct,
  product,
  productVariant,
} from "@/db/schema";
import type {
  HomeProduct,
  OptionType,
  Product,
  VariantWithDetails,
} from "@/types/product";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const [prod] = await db
      .select()
      .from(dbProduct)
      .where(and(eq(dbProduct.slug, slug), eq(dbProduct.isActive, true)))
      .limit(1);

    if (!prod) return null;

    const variants = await db
      .select()
      .from(productVariant)
      .where(eq(productVariant.productId, prod.id));

    const variantIds = variants.map((v) => v.id);

    const allMedia = await db
      .select()
      .from(media)
      .where(inArray(media.refId, [prod.id, ...variantIds]));

    const productMedia = allMedia
      .filter((m) => m.refId === prod.id && m.refType === "product")
      .sort((a, b) => a.position - b.position);

    const variantMediaMap = new Map<string, typeof allMedia>();

    for (const m of allMedia) {
      if (m.refType === "variant") {
        const list = variantMediaMap.get(m.refId) ?? [];
        list.push(m);
        variantMediaMap.set(m.refId, list);
      }
    }

    const mediaItems = productMedia.map((m) => ({
      _id: m.id,
      mediaType: m.mediaType as "image" | "video",
      title: m.altText || "",
      thumbnail: m.thumbnailUrl
        ? { url: m.thumbnailUrl, altText: m.altText || "" }
        : undefined,
      image:
        m.mediaType === "image"
          ? { url: m.url, altText: m.altText || "" }
          : undefined,
      video: m.mediaType === "video" ? { files: [{ url: m.url }] } : undefined,
    }));

    const basePrice = parseFloat(prod.basePrice);
    const salePrice = prod.salePrice ? parseFloat(prod.salePrice) : basePrice;

    const discountValue = prod.discount?.value || 0;
    const discountType = prod.discount?.type || "none";

    let finalPrice = salePrice;
    if (discountType === "percent") {
      finalPrice = salePrice * (1 - discountValue / 100);
    } else if (discountType === "amount") {
      finalPrice = salePrice - discountValue;
    }
    const calculateFinalPrice = (price: number) => {
      if (discountType === "percent") {
        return price * (1 - discountValue / 100);
      } else if (discountType === "amount") {
        return Math.max(0, price - discountValue);
      }
      return price;
    };

    const priceData = {
      currency: prod.currency || "INR",
      price: basePrice,
      discountedPrice: finalPrice,
    };

    const productOptions = (prod.productOptions || []).map((option) => {
      const choices = option.choices.map((choice) => {
        const matchingVariants = variants.filter((v) => {
          const optionValues = v.optionValues as Record<string, string>;
          return optionValues[option.name] === choice.description;
        });

        const choiceMediaItems = matchingVariants.flatMap((variant) =>
          (variantMediaMap.get(variant.id) || []).map((m) => ({
            _id: m.id,
            mediaType: m.mediaType as "image" | "video",
            title: m.altText || "",
            thumbnail: m.thumbnailUrl
              ? { url: m.thumbnailUrl, altText: m.altText || "" }
              : undefined,
            image:
              m.mediaType === "image"
                ? { url: m.url, altText: m.altText || "" }
                : undefined,
            video:
              m.mediaType === "video" ? { files: [{ url: m.url }] } : undefined,
          }))
        );

        return {
          ...choice,
          media:
            choiceMediaItems.length > 0
              ? {
                  mainMedia: choiceMediaItems[0],
                  items: choiceMediaItems,
                }
              : undefined,
        };
      });

      return {
        ...option,
        optionType: option.optionType as OptionType,
        choices,
      };
    });

    const variantsWithDetails: VariantWithDetails[] = variants.map((v) => {
      const rawVariantPrice = v.price ? parseFloat(v.price) : basePrice;
      const variantSalePrice = v.price ? rawVariantPrice : salePrice;
      const variantFinalPrice = calculateFinalPrice(variantSalePrice);

      return {
        _id: v.id,
        choices: v.optionValues as Record<string, string>,
        variant: {
          priceData: {
            currency: prod.currency || "INR",
            price: rawVariantPrice,
            discountedPrice: variantFinalPrice,
          },
          convertedPriceData: {
            currency: prod.currency || "INR",
            price: rawVariantPrice,
            discountedPrice: variantFinalPrice,
          },
          sku: v.sku || "",
          visible: true,
        },
        stock: {
          trackQuantity: v.trackInventory,
          quantity: v.stockQuantity,
          inStock: v.stockQuantity > 0,
        },
      };
    });

    const allOutOfStock = variantsWithDetails.every((v) => !v.stock.inStock);

    const inventoryStatus = allOutOfStock
      ? "OUT_OF_STOCK"
      : variantsWithDetails.every((v) => v.stock.inStock)
        ? "IN_STOCK"
        : "PARTIALLY_OUT_OF_STOCK";

    const enrichedProduct: Product = {
      _id: prod.id,
      name: prod.name,
      slug: prod.slug,
      visible: prod.isActive || true,
      description: prod.description || undefined,
      media: {
        mainMedia: mediaItems[0],
        items: mediaItems,
      },
      stock: {
        trackInventory: false,
        inStock: !allOutOfStock,
        inventoryStatus: inventoryStatus as
          | "IN_STOCK"
          | "OUT_OF_STOCK"
          | "PARTIALLY_OUT_OF_STOCK",
      },
      priceData,
      additionalInfoSections:
        (prod.additionalInfoSections as Array<{
          title: string;
          description: string;
        }>) || [],
      ribbons: prod.ribbon ? [{ text: prod.ribbon }] : [],
      ribbon: prod.ribbon || undefined,
      productOptions,
      discount: prod.discount
        ? {
            type: prod.discount.type === "percent" ? "PERCENT" : "AMOUNT",
            value: prod.discount.value,
          }
        : undefined,
      variants: variantsWithDetails,
      lastUpdated: prod.updatedAt.toISOString(),
      brand: prod.brand || undefined,
    };

    return enrichedProduct;
  } catch {
    return null;
  }
}

export async function getHomeProducts(): Promise<HomeProduct[] | []> {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: media.url,
      })
      .from(product)
      .leftJoin(
        media,
        and(
          eq(product.id, media.refId),
          eq(media.refType, "product"),
          eq(media.position, 0)
        )
      )
      .where(eq(product.isActive, true));

    if (!products || products.length === 0) {
      return [];
    }
    return products;
  } catch {
    return [];
  }
}

export async function getRelatedProducts(
  currentSlug: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const products = await db.query.product.findMany({
      where: and(eq(dbProduct.isActive, true), ne(dbProduct.slug, currentSlug)),
      limit,
    });

    const relatedProducts: Product[] = [];

    for (const prod of products) {
      const productMedia = await db
        .select()
        .from(media)
        .where(and(eq(media.refId, prod.id), eq(media.refType, "product")))
        .orderBy(media.position)
        .limit(1);

      const mediaItems = productMedia.map((m) => ({
        _id: m.id,
        mediaType: m.mediaType as "image" | "video",
        title: m.altText || "",
        image:
          m.mediaType === "image"
            ? { url: m.url, altText: m.altText || "" }
            : undefined,
      }));

      const basePrice = parseFloat(prod.basePrice);
      const salePrice = prod.salePrice ? parseFloat(prod.salePrice) : basePrice;

      const discountValue = prod.discount?.value || 0;
      const discountType = prod.discount?.type || "none";

      let finalPrice = salePrice;
      if (discountType === "percent") {
        finalPrice = salePrice * (1 - discountValue / 100);
      } else if (discountType === "amount") {
        finalPrice = salePrice - discountValue;
      }

      relatedProducts.push({
        _id: prod.id,
        name: prod.name,
        slug: prod.slug,
        visible: prod.isActive || true,
        media: {
          mainMedia: mediaItems[0],
          items: mediaItems,
        },
        priceData: {
          currency: prod.currency || "INR",
          price: basePrice,
          discountedPrice: finalPrice,
        },
        ribbon: prod.ribbon || undefined,
        productOptions: [],
        variants: [],
        stock: { inStock: true },
      });
    }

    return relatedProducts;
  } catch {
    return [];
  }
}
