import Image from "next/image";

import { TRUST_BADGES } from "@/data/trust-badges";
export default function TrustBadges() {
  return (
    <section className="border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4.5">
        <div className="grid grid-cols-3 gap-12 md:gap-4">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <Image
                src={badge.image.src || badge.image}
                alt={badge.name}
                height={80}
                width={80}
                className="object-contain"
              />
              <p className="text-[11px] font-bold tracking-[0.2em] text-foreground uppercase">
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
