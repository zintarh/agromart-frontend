import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type StatCardsSkeletonProps = {
  count?: number
  variant?: "default" | "customer"
  className?: string
}

export function StatCardsSkeleton({
  count = 4,
  variant = "default",
  className,
}: StatCardsSkeletonProps) {
  const isCustomer = variant === "customer"

  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-xl border border-[#E8E8E8] bg-white",
            isCustomer ? "px-6 py-5" : "px-5 py-4"
          )}
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className={cn("h-8 w-16", isCustomer ? "mt-2" : "mt-1")} />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  )
}
