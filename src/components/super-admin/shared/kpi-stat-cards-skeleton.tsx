import { Skeleton } from "@/components/ui/skeleton"

export function KpiStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#E8E8E8] bg-white p-5 shadow-sm"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-7 w-20" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  )
}
