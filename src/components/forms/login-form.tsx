"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { login } from "@/lib/actions/user.actions";
import type { LoginValues } from "@/lib/validations";
import { loginSchema } from "@/lib/validations";

import LoadingButton from "../ui/loading-button";
import { PasswordInput } from "../ui/password-input";
export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValues) {
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}
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
                  placeholder="Enter your email"
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
          {isPending ? "Authenticating..." : "Log in"}
        </LoadingButton>
      </form>
    </Form>
  );
}
