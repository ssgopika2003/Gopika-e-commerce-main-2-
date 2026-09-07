"use client";
import Link from "next/link";

import AddToCartButton from "@/features/cart/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";
import type { Product as ProductType } from "@/types/product";

import IKImage from "./ik-image";

interface ProductProps {
  product: ProductType;
}

export default function Product({ product }: ProductProps) {
  const mainImage = product.media?.items?.[0]?.image?.url || "/placeholder.jpg";
  const mainAlt = product.media?.items?.[0]?.image?.altText || product.name;

  return (
    <Link href={`/products/${product.slug}`} className="group block space-y-3">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-100">
        <IKImage
          src={mainImage}
          alt={mainAlt}
          width={700}
          height={700}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.ribbon && (
          <span className="absolute top-2 left-2 bg-black px-2 py-1 text-xs font-medium text-white">
            {product.ribbon}
          </span>
        )}
        <div className="absolute right-0 bottom-4 left-0 flex translate-y-4 transform justify-center px-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <AddToCartButton
            product={product}
            selectedOptions={{}}
            quantity={1}
            className="w-full"
            size="sm"
          />
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <h3 className="leading-tight font-medium tracking-wide uppercase">
          {product.name}
        </h3>
        {product.priceData && (
          <div className="flex gap-2">
            {product.priceData.price !== product.priceData.discountedPrice && (
              <span className="text-muted-foreground line-through">
                {formatCurrency(
                  product.priceData.price,
                  product.priceData.currency
                )}
              </span>
            )}
            <span className="font-medium">
              {formatCurrency(
                product.priceData.discountedPrice,
                product.priceData.currency
              )}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
