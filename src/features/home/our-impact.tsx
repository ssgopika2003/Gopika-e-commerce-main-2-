import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

export default function OurImpact() {
  return (
    <section className="w-full overflow-hidden py-4 md:py-6">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-[28px] font-light tracking-wide text-[#2D2D2D] md:mb-12 md:text-[36px]">
          Our Impact
        </h2>
        <div className="relative flex flex-col items-center md:flex-row md:items-start">
          <div className="relative z-0 flex w-full gap-3 md:w-[60%] md:gap-4">
            <div className="w-1/2 rounded-sm bg-card p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:mt-12 md:w-[45%]">
              <img
                src="https://ik.imagekit.io/codernandan/assets/your-impact2.jpeg"
                alt="Artisan weaving"
                className="aspect-3/4 w-full rounded-sm object-cover"
              />
            </div>

            <div className="w-1/2 rounded-sm bg-card p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.1)] md:w-[50%]">
              <img
                src="https://ik.imagekit.io/codernandan/assets/your-impact1.jpeg"
                alt="Artisan group"
                className="aspect-3/4 w-full rounded-sm object-cover"
              />
            </div>
          </div>

          <div
            className={cn(
              "relative z-10 border border-border/50 bg-card",
              "w-[94%] md:w-[45%]",
              "p-6 md:p-12",
              "rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.12)]",
              "mt-[-40px] md:mt-24 md:-ml-28",
              "self-center"
            )}
          >
            <h3 className="mb-5 text-2xl font-medium tracking-tight text-foreground md:text-[32px]">
              Engineered for Stillness
            </h3>

            <p className="mb-6 text-[14px] leading-relaxed font-light tracking-wide text-muted-foreground md:text-[15px]">
              Every jar is wicked, poured, and labeled by hand in Kalyani. No
              factories, no machines—just a small team of students pouring their
              heart into every ounce of soy wax. When you light a DIYA, you
              light up our dream.
            </p>

            <Link
              href="/about-us"
              className="group relative inline-block text-[11px] font-bold tracking-[0.25em] text-foreground uppercase"
            >
              Learn More
              <span className="absolute -bottom-1.5 left-0 h-[1.2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
