import type { Metadata } from "next";

import { PRIVACY_POLICY } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Diya",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-4 text-2xl font-bold">Privacy Policy</h2>
      <div
        className="prose prose-stone dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY }}
      />
    </div>
  );
}
