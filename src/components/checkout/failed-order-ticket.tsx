"use client";

import { AlertTriangle, Check, Copy, XCircle } from "lucide-react";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, copyToClipboard } from "@/lib/utils";

const DashedLine = () => (
  <div
    className="w-full border-t-2 border-dashed border-border"
    aria-hidden="true"
  />
);

const Barcode = ({ value }: { value: string }) => {
  const hashCode = (s: string) =>
    s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  const seed = hashCode(value);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const bars = Array.from({ length: 60 }).map((_, index) => {
    const rand = random(seed + index);
    const width = rand > 0.7 ? 2.5 : 1.5;
    return { width };
  });

  const spacing = 1.5;
  const totalWidth =
    bars.reduce((acc, bar) => acc + bar.width + spacing, 0) - spacing;
  const svgWidth = 250;
  const svgHeight = 70;
  let currentX = (svgWidth - totalWidth) / 2;

  return (
    <div className="flex flex-col items-center py-2 opacity-50 grayscale">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="fill-current text-foreground"
      >
        {bars.map((bar, index) => {
          const x = currentX;
          currentX += bar.width + spacing;
          return (
            <rect key={index} x={x} y="10" width={bar.width} height="50" />
          );
        })}
      </svg>
      <p className="mt-2 text-sm tracking-[0.3em] text-muted-foreground italic">
        VOID / CANCELLED
      </p>
    </div>
  );
};

export interface FailedOrderTicketProps extends React.HTMLAttributes<HTMLDivElement> {
  orderId: string;
  trxId?: string;
  reason?: string;
}

const FailedOrderTicket = React.forwardRef<
  HTMLDivElement,
  FailedOrderTicketProps
>(({ className, orderId, trxId, reason, ...props }, ref) => {
  const [orderCopied, setOrderCopied] = React.useState(false);
  const [trxCopied, setTrxCopied] = React.useState(false);

  const handleCopyOrder = async (value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setOrderCopied(true);
      setTimeout(() => setOrderCopied(false), 2000);
    }
  };

  const handleCopyTrx = async (value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setTrxCopied(true);
      setTimeout(() => setTrxCopied(false), 2000);
    }
  };

  const truncateId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}...${id.slice(-6)}`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 w-full max-w-lg rounded-2xl border-destructive/10 bg-card font-sans text-card-foreground shadow-2xl transition-all",
        "animate-in duration-700 fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 h-1.5 w-full bg-destructive" />

      <div className="absolute top-40 -left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-background" />
      <div className="absolute top-40 -right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-background" />

      {/* Header */}
      <div className="flex flex-col items-center p-10 pb-6 text-center">
        <div className="animate-in rounded-full bg-destructive/10 p-4 delay-300 duration-700 zoom-in-50">
          <XCircle className="h-12 w-12 animate-in text-destructive delay-500 duration-500 zoom-in-75" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-destructive">
          Payment Failed
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          We couldn&apos;t process your transaction.
        </p>
      </div>

      <div className="px-10 pb-10">
        <DashedLine />

        {/* Order & Transaction Meta */}
        <div className="space-y-4 py-4 text-center">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Order Reference
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <p className="font-mono text-lg font-bold">
                {truncateId(orderId)}
              </p>
              <button
                onClick={() => handleCopyOrder(orderId)}
                className="rounded-md p-1 transition hover:bg-muted"
                title="Copy Order Reference"
              >
                {orderCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {trxId && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Transaction ID
              </p>

              <div className="mt-2 flex items-center justify-center gap-2">
                <p className="font-mono text-sm font-medium">
                  {truncateId(trxId)}
                </p>

                <button
                  onClick={() => handleCopyTrx(trxId)}
                  className="rounded-md p-1 transition hover:bg-muted"
                  aria-label="Copy Transaction ID"
                >
                  {trxCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <DashedLine />

        {/* Failure Reason */}
        <div className="py-4">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-[10px] font-bold tracking-widest text-destructive uppercase">
              Failure Reason
            </p>
          </div>
          <div className="rounded-xl border border-destructive/10 bg-destructive/5 p-5 text-center">
            <p className="text-sm leading-relaxed font-medium text-foreground italic">
              &quot;
              {reason || "The transaction was declined by the payment gateway."}
              &quot;
            </p>
          </div>
        </div>

        <DashedLine />

        {/* Accordion Section */}
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Payment & Refund Information</AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  No amount has been successfully captured for this transaction.
                  If any amount was temporarily debited, it will be
                  automatically refunded by your bank within 3–5 business days.
                </p>
                <p>
                  Your order has not been confirmed yet. Please retry the
                  payment using the same or a different payment method.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Need Assistance?</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  If the issue persists, please check with your bank or payment
                  provider for further clarification.
                </p>
                <p>
                  For immediate help, contact our support team with your Order
                  Reference number.
                </p>
                <p className="font-medium text-foreground">support@diya.com</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DashedLine />
        <div className="mt-8">
          <Barcode value={orderId} />
        </div>
      </div>
    </div>
  );
});

FailedOrderTicket.displayName = "FailedOrderTicket";

export { FailedOrderTicket };
