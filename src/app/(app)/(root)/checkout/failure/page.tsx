"use client";

import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  let message = "We encountered an issue while processing your payment.";
  if (payment === "invalid") {
    message = "The payment was invalid or the response could not be verified.";
  } else if (payment === "notfound") {
    message = "We couldn't locate your order. Please check in a moment.";
  } else if (payment === "error") {
    message = "Something went wrong during checkout. Please try again later.";
  }

  return (
    <div className="mt-20 flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent>
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Payment Failed</h1>
          <p className="mt-2 text-muted-foreground">{message}</p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/checkout" className="flex items-center gap-2">
              Try Again
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="mt-20 flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-md py-10 text-center">
            <CardContent>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-medium text-muted-foreground">
                Loading payment status...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <CheckoutFailureContent />
    </Suspense>
  );
}
