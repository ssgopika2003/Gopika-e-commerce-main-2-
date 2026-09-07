import { Badge } from "@/components/ui/badge";
import type { Discount } from "@/types/product";

interface DiscountBadgeProps {
  data: Discount;
}

export default function DiscountBadge({ data }: DiscountBadgeProps) {
  if (data.type === "PERCENT") {
    return <Badge>-{data.value}%</Badge>;
  }
  return <Badge>-${data.value}</Badge>;
}
