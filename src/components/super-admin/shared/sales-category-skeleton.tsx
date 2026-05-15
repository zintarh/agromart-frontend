import { Skeleton } from "@/components/ui/skeleton"

export function SalesCategorySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="flex items-baseline justify-between gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  )
}
