"use client"

import { useEffect, useState } from "react"

import { CustomerStatCard } from "@/components/super-admin/customer-management/customer-stat-card"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { fetchCategoryStats } from "@/lib/categories-table-api"

type CategoryStatsGridProps = {
  refreshKey?: number
}

export function CategoryStatsGrid({ refreshKey = 0 }: CategoryStatsGridProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [total, setTotal] = useState("0")

  useEffect(() => {
    let cancelled = false

    void fetchCategoryStats()
      .then((summary) => {
        if (!cancelled) setTotal(String(summary.total))
      })
      .catch(() => {
        if (!cancelled) setTotal("0")
      })
      .finally(() => {
        if (!cancelled) setIsInitialLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (isInitialLoading) {
    return <StatCardsSkeleton variant="customer" count={4} />
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <CustomerStatCard label="Total Categories" value={total} sublabel="All product categories" />
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
