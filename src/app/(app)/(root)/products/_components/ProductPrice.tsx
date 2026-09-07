import DiscountBadge from "@/components/common/discount-badge";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product, Variant } from "@/types/product";

interface ProductPriceProps {
  product: Product;
  selectedVariant: Variant | null;
}

export default function ProductPrice({
  product,
  selectedVariant,
}: ProductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null;

  // Use the highest available base price (variant or product) as the reference
  const displayPrice = priceData.discountedPrice;
  const displayBasePrice = Math.max(
    priceData.price,
    product.priceData?.price ?? 0
  );
  const hasDiscount = displayBasePrice - displayPrice > 0.01;

  return (
    <div className="flex items-center gap-2.5 text-xl font-bold">
      <span className={cn(hasDiscount && "text-muted-foreground line-through")}>
        {formatCurrency(
          hasDiscount ? displayBasePrice : displayPrice,
          priceData.currency
        )}
      </span>
      {hasDiscount && (
        <span>{formatCurrency(displayPrice, priceData.currency)}</span>
      )}
      {hasDiscount &&
        (product.discount ? (
          <DiscountBadge data={product.discount} />
        ) : (
          <Badge className="bg-destructive">
            -{Math.round((1 - displayPrice / displayBasePrice) * 100)}%
          </Badge>
        ))}
    </div>
  );
}
