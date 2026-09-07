import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  price: number | undefined;
  discountedPrice: number | undefined;
  className?: string;
}

const PriceView = ({ price, discountedPrice, className }: Props) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-semibold text-black", className)}>
          {formatCurrency(discountedPrice || price)}
        </span>
        {price && discountedPrice && price > discountedPrice && (
          <span
            className={cn(
              "text-xs font-medium text-zinc-500 line-through",
              className
            )}
          >
            {formatCurrency(price)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceView;
