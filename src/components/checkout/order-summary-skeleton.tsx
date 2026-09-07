import { Skeleton } from "@/components/ui/skeleton";

export function OrderSummarySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Skeleton className="h-20 w-20 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-20 w-20 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
