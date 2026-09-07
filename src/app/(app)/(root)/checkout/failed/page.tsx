"use client";

// this page relies on client-only hooks like useSearchParams which
// require a CSR bailout; disable static prerendering.
export const dynamic = "force-dynamic";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { FailedOrderTicket } from "@/components/checkout/failed-order-ticket";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import type { PaymentAttempt } from "@/types/payment";

function CheckoutFailedContent() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");
  const orderId = searchParams.get("orderId") || "N/A";
  const { data: attempt } = useQuery({
    queryKey: ["payment-attempt", txnId],
    queryFn: () =>
      kyInstance.get(`/api/payments/attempts/${txnId}`).json<PaymentAttempt>(),
    enabled: !!txnId,
  });

  const reason =
    attempt?.error ||
    searchParams.get("reason") ||
    "Payment was declined by the bank or cancelled by user.";

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex flex-col items-center">
        <FailedOrderTicket
          orderId={orderId}
          trxId={txnId || attempt?.gatewayTxnId || undefined}
          reason={reason}
          className="mb-6 shadow-2xl"
        />

        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="animate-pulse font-medium text-muted-foreground">
            Loading order details...
          </p>
        </div>
      }
    >
      <CheckoutFailedContent />
    </Suspense>
  );
}
