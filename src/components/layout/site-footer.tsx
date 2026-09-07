import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SUPPORT_EMAIL,
  SUPPORT_FACEBOOK,
  SUPPORT_INSTAGRAM,
  SUPPORT_TWITTER,
} from "@/lib/constants";

import NewsletterForm from "../common/news-letter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-card font-sans text-card-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Desktop Grid Layout */}
        <div className="mb-6 hidden grid-cols-4 gap-6 lg:grid">
          {/* Brand Section */}
          <div>
            <h2 className="text-xl font-bold tracking-[0.25em] uppercase">
              Diya
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Hand-poured scents that bring your most cherished memories to
              life.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide uppercase">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#collections"
                  className="transition-colors hover:text-primary"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about-us"
                  className="transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-wide uppercase">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-cancellation"
                  className="transition-colors hover:text-primary"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="transition-colors hover:text-primary"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="mb-12 lg:hidden">
          {/* Brand Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-[0.25em] uppercase">
              Diya
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Hand-poured scents that bring your most cherished memories to
              life.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shop">
              <AccordionTrigger className="text-lg font-semibold tracking-wide uppercase">
                Shop
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/#collections" className="block py-1">
                      All Products
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="company">
              <AccordionTrigger className="text-lg font-semibold tracking-wide uppercase">
                Company
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about-us" className="block py-1">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="block py-1">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="legal">
              <AccordionTrigger className="text-lg font-semibold tracking-wide uppercase">
                Legal
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/privacy-policy" className="block py-1">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="block py-1">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-cancellation" className="block py-1">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping-delivery" className="block py-1">
                      Shipping Policy
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Stay Connected Section*/}
        <div className="flex flex-col gap-6 border-t border-border/40 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <h3 className="text-lg font-semibold tracking-wide whitespace-nowrap uppercase">
              Stay Connected
            </h3>
            <div className="flex space-x-4">
              <Link
                href={SUPPORT_FACEBOOK}
                target="_blank"
                className="transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={SUPPORT_INSTAGRAM}
                target="_blank"
                className="transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={SUPPORT_TWITTER}
                target="_blank"
                className="transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href={`mailto:${SUPPORT_EMAIL}`}
                className="transition-colors hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Diya. All rights reserved.
      </div>
    </footer>
  );
}
