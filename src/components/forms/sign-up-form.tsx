"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
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
import { signUp } from "@/lib/actions/user.actions";
import type { SignUpValues } from "@/lib/validations";
import { signUpSchema } from "@/lib/validations";

import LoadingButton from "../ui/loading-button";
import { PasswordInput } from "../ui/password-input";

export default function SignUpForm() {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  function onSubmit(values: SignUpValues) {
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="h-11 border-border/50 bg-background/50 focus:bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 00000 00000"
                    className="h-11 border-border/50 bg-background/50 focus:bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  className="h-11 border-border/50 bg-background/50 focus:bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  className="h-11 border-border/50 bg-background/50 focus:bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          className="h-11 w-full text-[12px] font-bold tracking-[0.2em] uppercase"
          type="submit"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </LoadingButton>
      </form>
    </Form>
  );
}
