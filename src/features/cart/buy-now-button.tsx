import { CreditCardIcon } from "lucide-react";

import type { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useQuickCheckout as useQuickBuy } from "@/hooks/checkout";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface BuyNowButtonProps extends ButtonProps {
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export default function BuyNowButton({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) {
  const quickBuyQuery = useQuickBuy();

  return (
    <LoadingButton
      onClick={() =>
        quickBuyQuery.mutate({ product, quantity, selectedOptions })
      }
      loading={quickBuyQuery.isPending}
      variant="secondary"
      className={cn("flex gap-3 py-6", className)}
      {...props}
    >
      <CreditCardIcon />
      Buy now
    </LoadingButton>
  );
}
