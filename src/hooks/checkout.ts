import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { redirectToPayU } from "@/components/forms/payU-form";
import kyInstance from "@/lib/ky";
import { findVariant } from "@/lib/utils";
import type { CheckoutInitiateValues } from "@/lib/validations";
import type { AddToCartValues } from "@/types/cart";
import type {
  DirectCheckoutSession,
  PayUInitiateRequest,
} from "@/types/checkout";

export function useCartCheckout(options?: { onSuccess?: () => void }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function startCheckoutFlow() {
    setPending(true);

    try {
      const response = await kyInstance
        .post("/api/checkout/validate")
        .json<{ valid: boolean }>();

      if (response.valid) {
        options?.onSuccess?.();
        router.push("/checkout");
      }
    } catch {
      setPending(false);
    }
  }

  return { startCheckoutFlow, pending };
}

export function useQuickCheckout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      product,
      selectedOptions,
      quantity,
    }: AddToCartValues) => {
      const variantId = findVariant(product, selectedOptions)?._id ?? null;

      return kyInstance
        .post("/api/checkout/direct", {
          json: {
            productId: product._id,
            variantId,
            quantity,
          },
        })
        .json<DirectCheckoutSession>();
    },

    onSuccess(data) {
      const item = data?.items?.[0];

      if (!item) return;

      router.push(
        `/checkout?type=direct&variantId=${item.variantId}&qty=${item.quantity}`
      );
    },

    onError() {
      toast.error("Failed to start quick checkout. Please try again.");
    },
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (payload: CheckoutInitiateValues) => {
      return kyInstance
        .post("/api/checkout/initiate", { json: payload })
        .json<PayUInitiateRequest>();
    },
    onSuccess: (data) => {
      redirectToPayU(data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.message || "Checkout initiation failed. Please try again."
      );
    },
  });
}
