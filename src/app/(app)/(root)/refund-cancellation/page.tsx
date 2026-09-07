import type { Metadata } from "next";

import { REFUND_CANCELLATION } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Refund and Cancellation Policy for Diya",
};

export default function RefundCancellationPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-4 text-2xl font-bold">
        Refund and Cancellation Policy
      </h2>
      <div
        className="prose prose-stone dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: REFUND_CANCELLATION }}
      />
    </div>
  );
}
