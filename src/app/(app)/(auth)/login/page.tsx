import type { Metadata } from "next";
import Link from "next/link";

import LoginForm from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login | Diya",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="group flex items-center gap-2 no-underline">
            <div className="mb-1 text-primary transition-transform duration-500 group-hover:scale-110">
              <img className="h-12 w-12" src="/logo.svg" alt="Diya Logo" />
            </div>
            <span className="font-nickainley text-3xl font-bold tracking-[0.2em] text-foreground">
              Diya
            </span>
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details to access your account
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border/40 bg-card p-8 shadow-xl shadow-primary/5 transition-all duration-300 hover:shadow-primary/10">
          <LoginForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
