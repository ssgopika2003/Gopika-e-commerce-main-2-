import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import CTASection from "@/features/home/cta-section";
import OurImpact from "@/features/home/our-impact";
import Testimonials from "@/features/home/testimonials";
import TrustBadges from "@/features/home/trust-badges";
import ShopPage from "@/features/shop/shop-page";
import { getHomeProducts } from "@/lib/actions/product.actions";

export const revalidate = 3600;
export default async function Home() {
  const products = await getHomeProducts();

  return (
    <div className="mx-auto max-w-7xl p-2">
      <CTASection
        title="Hand-Poured Nostalgia"
        subtitle="From the chaos of circuits to the calm of soy wax. We are a group of students making eco-friendly, wooden-wick candles that sound like a tiny fireplace and smell like home."
        actions={[
          {
            text: "Explore Collection",
            href: "/#collections",
            variant: "default",
          },
          {
            text: "Our Story",
            href: "/about-us",
            variant: "outline",
          },
        ]}
        images={[
          "https://ik.imagekit.io/codernandan/assets/cta-s1.jpeg",
          "https://ik.imagekit.io/codernandan/banner/diya-b1.png",
          "https://ik.imagekit.io/codernandan/assets/cta-s2.jpg",
        ]}
      />
      <Suspense fallback={<Loader2 className="mx-auto size-4 animate-spin" />}>
        <ShopPage products={products} />
      </Suspense>
      <TrustBadges />
      <Testimonials />
      <OurImpact />
    </div>
  );
}
