"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import kyInstance from "@/lib/ky";
import type { Address } from "@/types";

interface SavedAddressesDialogProps {
  onSelect: (address: Address) => void;
}

export function SavedAddressesDialog({ onSelect }: SavedAddressesDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["saved-addresses"],
    queryFn: async () => {
      return kyInstance.get("api/addresses").json<Address[]>();
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Saved Addresses</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Saved Address</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto pr-4">
            <div className="flex flex-col gap-3">
              {addresses.map((addr: Address, index: number) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  onClick={() => {
                    onSelect(addr);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-medium">{addr.label || "Address"}</div>
                    {addr.isDefault && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    <p className="mt-1">{addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[150px] flex-col items-center justify-center text-center text-muted-foreground">
            <MapPin className="mb-2 h-8 w-8 opacity-50" />
            <p>No saved addresses found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
