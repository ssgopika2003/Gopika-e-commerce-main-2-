import { ShoppingCartIcon } from "lucide-react";

import type { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart();
  return (
    <LoadingButton
      className={cn("flex gap-2 rounded-md py-6", className)}
      onClick={() =>
        mutation.mutate({
          product,
          selectedOptions,
          quantity,
        })
      }
      loading={mutation.isPending}
      {...props}
    >
      <ShoppingCartIcon />
      Add to cart
    </LoadingButton>
  );
}
