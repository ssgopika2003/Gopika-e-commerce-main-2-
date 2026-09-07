"use client";

import { Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MAIN_NAV } from "@/config/site";
import ShoppingCartButton from "@/features/cart/shopping-cart-button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="font-outfit flex w-full flex-col">
      <div className="w-full overflow-hidden border-b border-primary bg-primary py-2 whitespace-nowrap select-none lg:py-2.5">
        <div className="animate-marquee inline-block">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="mx-6 text-[10px] font-medium tracking-[0.15em] text-primary-foreground/95 lg:mx-12 lg:text-[11px] lg:tracking-[0.2em]"
            >
              Best Deals At Checkout &nbsp; • &nbsp; Free Shipping On Orders
              Above 499 &nbsp; • &nbsp; 30% Off On First Order
            </span>
          ))}
        </div>
      </div>

      <header className="w-full">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex h-14 items-center justify-between">
            <div className="flex flex-1 items-center justify-start">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-auto p-0 transition-transform hover:scale-110 lg:hidden"
                  >
                    <Menu className="h-6 w-6 stroke-[1.5] text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-70 border-r-border bg-background p-0"
                >
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <nav className="mt-12 flex flex-col">
                    {MAIN_NAV.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="border-b border-border/40 px-8 py-4 text-[12px] font-bold tracking-[0.15em] text-muted-foreground"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="hidden lg:flex">
                <SearchBar />
              </div>
            </div>
            <Link
              href="/"
              className="group flex items-center gap-2 no-underline"
            >
              <div className="mb-1 text-primary transition-transform duration-500 group-hover:scale-105">
                <img className="size-10" src="/logo.svg" alt="Diya Logo" />
              </div>
              <span className="lg:text-5.5 font-nickainley text-[20px] leading-none font-bold tracking-[0.25em] text-foreground lg:tracking-[0.3em]">
                Diya
              </span>
            </Link>

            <div className="flex flex-1 items-center justify-end gap-3 lg:gap-6">
              <div className="lg:hidden">
                <SearchBar />
              </div>

              <Link
                className="p-0 text-foreground transition-transform hover:scale-110"
                href={!isPending && session ? "#" : "/signup"}
              >
                <UserRound className="size-4" />
              </Link>
              <ShoppingCartButton className="p-0 text-foreground transition-transform hover:scale-110" />
            </div>
          </div>

          <nav className="hidden justify-center py-2 lg:flex">
            <ul className="flex items-center gap-14">
              {MAIN_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-1 text-[11px] font-bold tracking-[0.25em] transition-colors duration-300",
                        isActive
                          ? "text-black"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {item.name}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-[1.2px] bg-primary transition-all duration-300 ease-in-out",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </Link>

                    {item.submenu && (
                      <ul className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <div className="min-w-50 border border-border bg-popover py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                          {item.submenu.map((sub) => (
                            <li key={sub}>
                              <Link
                                href="#"
                                className="block px-6 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-foreground transition-colors hover:bg-accent hover:text-primary"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </div>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
