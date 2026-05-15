"use client"

import { useEffect, useState } from "react"

import { StatCard } from "@/components/super-admin/shared/stat-card"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { fetchProductStats } from "@/lib/super-admin-table-api"

export function ProductStatsGrid() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: "0",
    active: "0",
    outOfStock: "0",
    lowStock: "0",
    activePercent: "0% active",
  })

  useEffect(() => {
    let cancelled = false

    void fetchProductStats()
      .then((summary) => {
        if (cancelled) return
        const activePercent =
          summary.total > 0
            ? `${Math.round((summary.active / summary.total) * 100)}% active`
            : "0% active"
        setStats({
          total: String(summary.total),
          active: String(summary.active),
          outOfStock: String(summary.outOfStock),
          lowStock: String(summary.lowStock),
          activePercent,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setStats({
            total: "0",
            active: "0",
            outOfStock: "0",
            lowStock: "0",
            activePercent: "0% active",
          })
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return <StatCardsSkeleton />
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Product" value={stats.total} sublabel="All products" />
      <StatCard label="Active" value={stats.active} sublabel={stats.activePercent} />
      <StatCard
        label="Out of Stock"
        value={stats.outOfStock}
        sublabel="Need restocking"
        sublabelClassName="text-destructive"
      />
      <StatCard
        label="Low Stock"
        value={stats.lowStock}
        sublabel="Below threshold"
        sublabelClassName="text-[#E67E22]"
      />
    </div>
  )
}
