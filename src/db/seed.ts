/* eslint-disable no-console */
import "dotenv/config";

import { v7 as uuidv7 } from "uuid";

import { ALL_PRODUCTS } from "@/data/products";
import { db } from "@/db";
import { category, media, product, productVariant } from "@/db/schema";

async function main() {
  console.log("🌱 Seeding database with Diya products...");

  try {
    // 1️⃣ Upsert Category
    const [candleCategory] = await db
      .insert(category)
      .values({
        id: uuidv7(),
        name: "Candles",
        slug: "candles",
        description: "Hand-poured signature scents for your home.",
        isActive: true,
      })
      .onConflictDoUpdate({
        target: category.slug,
        set: {
          name: "Candles",
          isActive: true,
        },
      })
      .returning();

    // 2️⃣ Loop Products
    for (const item of ALL_PRODUCTS) {
      const [insertedProduct] = await db
        .insert(product)
        .values({
          name: item.name,
          slug: item.slug,
          description: item.description,
          basePrice: String(item.priceData?.price ?? 0),
          salePrice: item.priceData?.discountedPrice
            ? String(item.priceData.discountedPrice)
            : null,
          currency: item.priceData?.currency ?? "INR",
          brand: item.brand ?? "Diya",
          ribbon: item.ribbon ?? null,
          isActive: true,
          isFeatured: false,
          categoryId: candleCategory.id,
          additionalInfoSections: item.additionalInfoSections ?? [],
          productOptions: item.productOptions
            ? item.productOptions.map((opt) => ({
                name: opt.name,
                optionType: String(opt.optionType), // Convert enum to string
                choices: opt.choices.map((choice) => ({
                  value: choice.value,
                  description: choice.description,
                  inStock: choice.inStock,
                  visible: choice.visible,
                })),
              }))
            : [],
        })
        .onConflictDoUpdate({
          target: product.slug,
          set: {
            name: item.name,
            description: item.description,
            basePrice: String(item.priceData?.price ?? 0),
            salePrice: item.priceData?.discountedPrice
              ? String(item.priceData.discountedPrice)
              : null,
            productOptions: item.productOptions
              ? item.productOptions.map((opt) => ({
                  name: opt.name,
                  optionType: String(opt.optionType),
                  choices: opt.choices.map((choice) => ({
                    value: choice.value,
                    description: choice.description,
                    inStock: choice.inStock,
                    visible: choice.visible,
                  })),
                }))
              : [],
          },
        })
        .returning();

      const productId = insertedProduct.id;

      // 3️⃣ Insert Media
      if (item.media?.items?.length) {
        await db.insert(media).values(
          item.media.items.map((m, index) => ({
            id: uuidv7(),
            url: m.image?.url ?? "",
            altText: m.image?.altText ?? item.name,
            mediaType: "image" as const,
            refId: productId,
            refType: "product" as const,
            position: index,
          }))
        );
      }

      // 4️⃣ Insert Variants
      if (item.productOptions && item.productOptions.length > 0) {
        // build all combinations of choices across every option
        const combinations: Array<
          Record<string, { description: string; value: string }>
        > = [];

        const build = (
          idx: number,
          current: Record<string, { description: string; value: string }>
        ) => {
          if (idx === item.productOptions!.length) {
            combinations.push({ ...current });
            return;
          }

          const opt = item.productOptions![idx];
          for (const choice of opt.choices) {
            current[opt.name] = {
              description: choice.description,
              value: choice.value,
            };
            build(idx + 1, current);
          }
        };

        build(0, {} as Record<string, { description: string; value: string }>);

        for (const combo of combinations) {
          // compute sku fragment and price modifier
          const skuSuffix = Object.values(combo)
            .map((c) => c.description.replace(/\s+/g, "-").toUpperCase())
            .join("-");

          let price =
            item.priceData?.discountedPrice ?? item.priceData?.price ?? 0;
          // material adjustment: wooden adds 13
          if (combo["Wick"]?.value === "wooden") {
            price += 13;
          }

          await db
            .insert(productVariant)
            .values({
              id: uuidv7(),
              productId,
              sku: `${item.slug.toUpperCase()}-${skuSuffix}`,
              price: String(price),
              costPrice: "00.00",
              stockQuantity: item.stock?.quantity ?? 10,
              trackInventory: true,
              optionValues: Object.fromEntries(
                Object.entries(combo).map(([k, v]) => [k, v.description])
              ),
            })
            .onConflictDoUpdate({
              target: productVariant.sku,
              set: {
                optionValues: Object.fromEntries(
                  Object.entries(combo).map(([k, v]) => [k, v.description])
                ),
                price: String(price),
                stockQuantity: item.stock?.quantity ?? 10,
              },
            });
        }
      } else {
        // Single default variant
        await db
          .insert(productVariant)
          .values({
            id: uuidv7(),
            productId,
            sku: `${item.slug.toUpperCase()}-STD`,
            price: String(
              item.priceData?.discountedPrice ?? item.priceData?.price ?? 0
            ),
            costPrice: "108.00",
            stockQuantity: item.stock?.quantity ?? 10,
            trackInventory: true,
            optionValues: {},
          })
          .onConflictDoUpdate({
            target: productVariant.sku,
            set: {
              optionValues: {},
              price: String(
                item.priceData?.discountedPrice ?? item.priceData?.price ?? 0
              ),
              stockQuantity: item.stock?.quantity ?? 10,
            },
          });
      }
    }

    console.log("✅ Seeding complete! All products inserted.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

main();
