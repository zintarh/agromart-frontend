import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type DashboardCardSkeletonProps = {
  children?: React.ReactNode
  className?: string
  minHeight?: string
}

export function DashboardCardSkeleton({
  children,
  className,
  minHeight = "min-h-[200px]",
}: DashboardCardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E8E8E8] bg-white p-5 shadow-sm",
        minHeight,
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>
      {children ?? <Skeleton className="h-[180px] w-full rounded-lg" />}
    </div>
  )
}
