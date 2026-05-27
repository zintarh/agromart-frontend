"use client"

import { useQuery } from "@tanstack/react-query"

import { StatCard } from "@/components/super-admin/shared/stat-card"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { productQueryKeys } from "@/lib/product-query-keys"
import { fetchProductStats } from "@/lib/products-table-api"

export function ProductStatsGrid() {
  const { data: summary, isLoading } = useQuery({
    queryKey: productQueryKeys.stats(),
    queryFn: fetchProductStats,
  })

  if (isLoading || !summary) return <StatCardsSkeleton />

  const activePercent =
    summary.total > 0
      ? `${Math.round((summary.active / summary.total) * 100)}% active`
      : "0% active"

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Products" value={String(summary.total)} sublabel="All products" />
      <StatCard label="Active" value={String(summary.active)} sublabel={activePercent} />
      <StatCard
        label="Pending"
        value={String(summary.pending)}
        sublabel="Awaiting review"
        sublabelClassName="text-[#E67E22]"
      />
      <StatCard
        label="Rejected"
        value={String(summary.rejected)}
        sublabel="Not approved"
        sublabelClassName="text-destructive"
      />
    </div>
  )
}
