/* eslint-disable react-hooks/purity */
"use client";

import Image from "next/image";
import * as React from "react";

import { cn, formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/order";

// --- SVG Icons ---

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// --- Helper Components ---

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
    <div className="flex flex-col items-center py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-label={`Barcode for value ${value}`}
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
      <p className="mt-2 text-sm tracking-[0.3em] text-muted-foreground">
        {value}
      </p>
    </div>
  );
};

const ConfettiExplosion = () => {
  const confettiCount = 100;
  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#8b5cf6",
    "#f97316",
  ];

  return (
    <>
      <style>
        {`
          @keyframes fall {
            0% {
                transform: translateY(-10vh) rotate(0deg);
                opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <div
            key={i}
            className="absolute h-4 w-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-20 + Math.random() * 10}%`,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `fall ${2.5 + Math.random() * 2.5}s ${Math.random() * 2}s linear forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// --- Main Integrated Ticket Component ---

export interface IntegratedOrderTicketProps extends React.HTMLAttributes<HTMLDivElement> {
  order: Order;
}

const IntegratedOrderTicket = React.forwardRef<
  HTMLDivElement,
  IntegratedOrderTicketProps
>(({ className, order, ...props }, ref) => {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    const mountTimer = setTimeout(() => setShowConfetti(true), 100);
    const unmountTimer = setTimeout(() => setShowConfetti(false), 6000);
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(order.createdAt))
    .replace(",", " •");

  return (
    <>
      {showConfetti && <ConfettiExplosion />}
      <div
        ref={ref}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-card font-sans text-card-foreground shadow-2xl transition-all",
          "animate-in duration-700 fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {/* Ticket cut-out effect at the top section */}
        <div className="absolute top-40 -left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-background" />
        <div className="absolute top-40 -right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-background" />

        {/* Success Header */}
        <div className="flex flex-col items-center p-10 pb-6 text-center">
          <div className="animate-in rounded-full bg-primary/10 p-4 delay-300 duration-700 zoom-in-50">
            <CheckCircleIcon className="h-12 w-12 animate-in text-primary delay-500 duration-500 zoom-in-75" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Thank you!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your order has been placed successfully
          </p>
        </div>

        <div className="px-10 pb-10">
          <DashedLine />

          {/* Order Meta */}
          <div className="grid grid-cols-2 gap-4 py-8 text-left">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Order Number
              </p>
              <p className="mt-1 font-mono text-sm font-medium">
                #{order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Date & Time
              </p>
              <p className="mt-1 text-sm font-medium">{formattedDate}</p>
            </div>
          </div>

          <DashedLine />

          {/* Items List */}
          <div className="py-4">
            <p className="mb-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Order Items
            </p>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-primary/5 bg-muted shadow-sm">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} ×{" "}
                      {formatCurrency(Number(item.price))}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-bold">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <DashedLine />

          {/* Summary */}
          <div className="space-y-3 py-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(Number(order.subtotal))}
              </span>
            </div>
            {Number(order.shippingCost) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {formatCurrency(Number(order.shippingCost))}
                </span>
              </div>
            )}
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(Number(order.discount))}</span>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-6">
              <span className="text-xl font-bold">Total Amount</span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(Number(order.total))}
              </span>
            </div>
          </div>

          <DashedLine />

          {/* Footer Barcode */}
          <div className="mt-8">
            <Barcode value={order.orderNumber} />
          </div>
        </div>
      </div>
    </>
  );
});

IntegratedOrderTicket.displayName = "IntegratedOrderTicket";

export { IntegratedOrderTicket };
