import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface BackInStockNotificationButtonProps {
  product: Product;
  selectedOptions: Record<string, string>;
}

export default function BackInStockNotificationButton({}: BackInStockNotificationButtonProps) {
  return (
    <Button variant="secondary" disabled>
      Notify When Available
    </Button>
  );
}
