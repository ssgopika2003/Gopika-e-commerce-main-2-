import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

import Product from "@/components/common/product";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/actions/product.actions";
import { delay } from "@/lib/utils";

import ProductDetails from "../_components/ProductDetails";

interface PageProps {
  params: Promise<{ slug: string }>;
}
const getProductCached = cache(async (slug: string) => {
  return getProductBySlug(slug);
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductCached(slug);

  if (!product) notFound();
  const mainImage = product.media?.items?.[0]?.image;

  return {
    title: product.name,
    description: "Get this product on Local Shop",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { slug } = params;
  await delay(100);

  const product = await getProductCached(slug);

  if (!product?._id) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <hr className="border-gray-200" />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts currentSlug={slug} />
      </Suspense>
    </main>
  );
}

async function RelatedProducts({ currentSlug }: { currentSlug: string }) {
  const relatedProducts = await getRelatedProducts(currentSlug);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-80 w-full" />
      ))}
    </div>
  );
}
