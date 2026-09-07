"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  MapPin,
  Percent,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import { OrderSummarySkeleton } from "@/components/checkout/order-summary-skeleton";
import CheckoutForm from "@/components/forms/checkout-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { useCart } from "@/hooks/cart";
import { FREE_SHIPPING_THRESHOLD_ITEMS, SHIPPING_COST } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import type {
  CouponApplyResponse,
  DirectCheckoutSession,
} from "@/types/checkout";

interface DisplayItem {
  key: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions: Record<string, string>;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isDirect = searchParams.get("type") === "direct";
  const variantId = searchParams.get("variantId");
  const quantity = parseInt(searchParams.get("qty") || "1");

  const { data: cartData, isLoading: isCartLoading } = useCart(null);

  const { data: directData, isLoading: isDirectLoading } = useQuery({
    queryKey: ["direct-checkout", variantId, quantity],
    queryFn: async () => {
      return kyInstance
        .post("/api/checkout/direct", { json: { variantId, quantity } })
        .json<DirectCheckoutSession>();
    },
    enabled: isDirect && !!variantId,
  });

  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponApplyResponse | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const displayItems = useMemo((): DisplayItem[] => {
    if (isDirect && directData) {
      return directData.items.map((item) => ({
        key: item.variantId || item.itemId,
        name: item.name,
        image: item.image || "/placeholder.png",
        price: item.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
      }));
    }
    return (cartData?.items ?? []).map((item) => ({
      key: item.variantId || item.cartItemId,
      name: item.product.name,
      image: item.product.imageUrl || "/placeholder.png",
      price: item.product.discountedPrice,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
    }));
  }, [isDirect, directData, cartData]);

  const subtotal = useMemo(() => {
    if (isDirect && directData) return directData.subtotal;
    return cartData?.subtotal || 0;
  }, [isDirect, directData, cartData]);

  const { mutate: handleApplyCoupon, isPending: isCouponPending } = useMutation(
    {
      mutationFn: async (code: string) => {
        return kyInstance
          .post("/api/coupons/apply", { json: { code, subtotal } })
          .json<CouponApplyResponse>();
      },
      onSuccess: (data) => {
        setAppliedCoupon(data);
        setCouponCode("");
        toast.success("Coupon applied!");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(error.message || "Invalid coupon");
        setAppliedCoupon(null);
      },
    }
  );

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const totalQuantity = displayItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const discount = appliedCoupon?.discountAmount ?? 0;
  const shipping =
    totalQuantity >= FREE_SHIPPING_THRESHOLD_ITEMS ? 0 : SHIPPING_COST;
  const total = subtotal - discount + shipping;

  const isLoading = isCartLoading || (isDirect && isDirectLoading);

  return (
    <div className="bg-liner-to-b min-h-screen from-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 transition-all hover:gap-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="h-8 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Checkout
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-primary/20 shadow-sm">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold tracking-tight">
                      Shipping Details
                    </h2>
                  </div>
                  {/* <SavedAddressesDialog onSelect={setSelectedAddress} /> */}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CheckoutForm
                  selectedAddress={null}
                  cartId={cartData?.id}
                  isDirect={isDirect}
                  variantId={variantId || undefined}
                  quantity={quantity}
                  couponCode={appliedCoupon?.code}
                  total={total}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden border-primary/20 shadow-sm">
              <CardHeader className="border-b bg-primary/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">Order Summary</h3>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-4">
                {isLoading ? (
                  <OrderSummarySkeleton />
                ) : displayItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingBag className="mb-2 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Your checkout is empty
                    </p>
                  </div>
                ) : (
                  <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-2">
                    {displayItems.map((item) => {
                      const itemPrice = parseFloat(String(item.price || "0"));
                      return (
                        <div
                          key={item.key}
                          className="flex gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                            <img
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-sm">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <p className="line-clamp-2 text-sm leading-tight font-semibold">
                                {item.name}
                              </p>
                              {item.selectedOptions &&
                                Object.keys(item.selectedOptions).length >
                                  0 && (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {Object.entries(item.selectedOptions).map(
                                      ([key, value]) => (
                                        <span key={key} className="block">
                                          {key}: {String(value)}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {item.quantity} x ₹{itemPrice.toFixed(2)}
                              </span>
                              <span className="text-sm font-bold text-primary">
                                ₹{(itemPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoading && displayItems.length > 0 && (
                  <div className="flex flex-col gap-3 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>Have a coupon?</span>
                    </div>
                    {!appliedCoupon ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            className="flex-1 uppercase"
                          />
                          <LoadingButton
                            loading={isCouponPending}
                            onClick={() => {
                              if (!couponCode)
                                return toast.error("Please enter a code");
                              handleApplyCoupon(couponCode);
                            }}
                            size="lg"
                          >
                            Apply
                          </LoadingButton>
                        </div>
                        {couponError && (
                          <p className="text-xs text-destructive">
                            {couponError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border-2 border-green-500/20 bg-green-50 p-3 dark:bg-green-950/30">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!isLoading && displayItems.length > 0 && (
                  <div className="flex flex-col gap-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping > 0 ? `₹${shipping.toFixed(2)}` : "FREE"}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -₹{discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="bg-liner-to-b flex min-h-screen items-center justify-center from-background to-muted/20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="animate-pulse font-medium text-muted-foreground">
              Loading checkout...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
