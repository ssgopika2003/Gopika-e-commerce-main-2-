"use client";

import { useQuery } from "@tanstack/react-query";
import { PackageX, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import kyInstance from "@/lib/ky";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/order";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  authorized: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

function StatusBadge({
  label,
  colorMap,
}: {
  label: string;
  colorMap: Record<string, string>;
}) {
  const cls = colorMap[label] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => kyInstance.get("/api/orders").json<{ orders: Order[] }>(),
    retry: false,
  });

  if (isError) {
    router.replace("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-4 h-40 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingBag className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center text-muted-foreground">
          <PackageX className="h-12 w-12 opacity-40" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm">Your completed orders will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-primary/10 bg-card shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-primary/5 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order</p>
                  <p className="font-mono text-sm font-semibold">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label={order.status} colorMap={STATUS_COLORS} />
                  <StatusBadge
                    label={order.paymentStatus}
                    colorMap={PAYMENT_STATUS_COLORS}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="divide-y px-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.name ?? "Product"}
                      </p>
                      {item.selectedOptions &&
                        Object.keys(item.selectedOptions).length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {Object.entries(item.selectedOptions)
                              .map(([k, v]) => `${k}: ${String(v)}`)
                              .join(", ")}
                          </p>
                        )}
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 px-4 py-3">
                {order.shippingAddress && (
                  <p className="text-xs text-muted-foreground">
                    Ship to: {order.shippingAddress.fullName},{" "}
                    {order.shippingAddress.city}
                  </p>
                )}
                <p className="ml-auto text-sm font-semibold">
                  Total: {formatCurrency(Number(order.total))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
