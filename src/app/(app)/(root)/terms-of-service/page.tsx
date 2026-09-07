import type { Metadata } from "next";

import { TERMS_OF_SERVICE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Diya",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-4 text-2xl font-bold">Terms and Conditions</h2>
      <div
        className="prose prose-stone dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: TERMS_OF_SERVICE }}
      />
    </div>
  );
}
