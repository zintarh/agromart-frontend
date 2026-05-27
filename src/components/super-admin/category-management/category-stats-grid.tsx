"use client"

import { useQuery } from "@tanstack/react-query"

import { CustomerStatCard } from "@/components/super-admin/customer-management/customer-stat-card"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { fetchCategoryStats } from "@/lib/categories-table-api"
import { categoryQueryKeys } from "@/lib/category-query-keys"

export function CategoryStatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: categoryQueryKeys.stats(),
    queryFn: fetchCategoryStats,
  })

  if (isLoading && !data) {
    return <StatCardsSkeleton variant="customer" count={4} />
  }

  const total = data?.total ?? 0

  return (
    <div className="grid grid-cols-4 gap-4">
      <CustomerStatCard label="Total Categories" value={String(total)} sublabel="All product categories" />
      <CustomerStatCard label="Active Listings" value="0" sublabel="Products using categories" />
      <CustomerStatCard
        label="Empty Categories"
        value="0"
        sublabel="No products assigned"
        sublabelClassName="text-muted-foreground"
      />
      <CustomerStatCard
        label="Last Added"
        value="0"
        sublabel="Most recent category"
        sublabelClassName="text-muted-foreground"
      />
    </div>
  )
}
