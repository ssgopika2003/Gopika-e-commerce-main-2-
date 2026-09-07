"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  if (!orderId) {
    return (
      <div className="mt-20 flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md py-10 text-center">
          <CardContent>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-medium text-muted-foreground">
              Redirecting...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // display generic success message without calling protected API
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Thank you for your order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order <strong>#{orderId}</strong> has been placed successfully.
        </p>
        <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Button asChild className="text-md w-full shadow-lg" size="lg">
            <Link href="/" className="flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mt-20 flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-md py-10 text-center">
            <CardContent>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-medium text-muted-foreground">
                Loading order details...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
