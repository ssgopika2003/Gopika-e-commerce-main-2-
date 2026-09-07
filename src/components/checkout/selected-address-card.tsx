import { MapPin, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GuestShippingValues } from "@/lib/validations";
import type { Address } from "@/types";

interface SelectedAddressCardProps {
  address: Address;
  onChange: () => void;
  onConfirm?: (values: GuestShippingValues) => void;
  renderAction?: (values: GuestShippingValues) => React.ReactNode;
}

function toShippingValues(addr: Address): GuestShippingValues {
  return {
    fullName: addr.fullName,
    email: "",
    phone: addr.phone ?? "",
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2 ?? undefined,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
  };
}

export function SelectedAddressCard({
  address,
  onChange,
  onConfirm,
  renderAction,
}: SelectedAddressCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-sm">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Shipping Information</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChange}
            className="gap-2"
          >
            <Pencil className="h-3.5 w-3.5" />
            Change
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-foreground">
                {address.label || "Delivery Address"}
              </span>
              {address.isDefault && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Default
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{address.fullName}</p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="font-medium text-foreground">Phone:</span>
                <span>{address.phone}</span>
              </div>
            </div>
          </div>

          {renderAction && renderAction(toShippingValues(address))}

          {!renderAction && onConfirm && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => onConfirm(toShippingValues(address))}
            >
              Deliver Here &amp; Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
