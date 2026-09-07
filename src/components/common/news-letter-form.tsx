"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          message: "New Newsletter Subscription",
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-l-md border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-r-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
