import type { Metadata } from "next";

import { SHIPPING_DELIVERY } from "@/config/site";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy",
  description: "Shipping and Delivery Policy for Diya",
};

export default function ShippingDeliveryPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-4 text-2xl font-bold">Shipping and Delivery Policy</h2>
      <div
        className="prose prose-stone dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: SHIPPING_DELIVERY }}
      />
    </div>
  );
}
