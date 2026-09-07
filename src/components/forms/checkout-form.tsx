"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useInitiatePayment } from "@/hooks/checkout";
import type { GuestShippingValues } from "@/lib/validations";
import { guestShippingSchema } from "@/lib/validations";

import LoadingButton from "../ui/loading-button";

interface CheckoutFormProps {
  selectedAddress?: GuestShippingValues | null;
  prefillEmail?: string;
  cartId?: string;
  isDirect?: boolean;
  variantId?: string;
  quantity?: number;
  couponCode?: string;
  total?: number;
  isLoading?: boolean;
}

export default function CheckoutForm({
  selectedAddress,
  prefillEmail,
  cartId,
  isDirect,
  variantId,
  quantity,
  couponCode,
  isLoading,
}: CheckoutFormProps) {
  const mutation = useInitiatePayment();

  const form = useForm<GuestShippingValues>({
    resolver: zodResolver(guestShippingSchema),
    defaultValues: {
      fullName: "",
      email: prefillEmail ?? "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      form.reset(selectedAddress);
    }
  }, [selectedAddress, form]);

  useEffect(() => {
    if (prefillEmail && !form.getValues("email")) {
      form.setValue("email", prefillEmail);
    }
  }, [prefillEmail, form]);

  function handleSubmit(values: GuestShippingValues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { shippingDetails: values };

    if (isDirect && variantId) {
      payload.isDirect = true;
      payload.variantId = variantId;
      payload.quantity = quantity;
    } else if (cartId) {
      payload.cartId = cartId;
    }

    if (couponCode) {
      payload.couponCode = couponCode;
    }

    mutation.mutate(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 XXXXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Vilage</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Maharashtra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN Code</FormLabel>
                <FormControl>
                  <Input placeholder="400001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          loading={mutation.isPending}
          disabled={isLoading || mutation.isPending}
          className="text-md w-full font-bold shadow-lg"
          size="lg"
          type="submit"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <span>Place Order</span>
          </div>
        </LoadingButton>
      </form>
    </Form>
  );
}
