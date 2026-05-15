"use client"

import { useEffect, useState } from "react"

import { CustomerStatCard } from "@/components/super-admin/customer-management/customer-stat-card"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { fetchCustomerStats } from "@/lib/super-admin-table-api"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"

type CustomerStatsGridProps = {
  tab: UserManagementTab
  refreshKey?: number
}

export function CustomerStatsGrid({ tab, refreshKey = 0 }: CustomerStatsGridProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: "0",
    active: "0",
    suspended: "0",
    verified: "0",
    activePercent: "0% active",
    verifiedPercent: "0% verified",
  })

  const showCustomerMetrics = isCustomerTab(tab)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    void fetchCustomerStats(tab.role)
      .then((summary) => {
        if (cancelled) return
        const activePercent =
          summary.total > 0
            ? `${Math.round((summary.active / summary.total) * 100)}% active`
            : "0% active"
        const verifiedPercent =
          summary.total > 0
            ? `${Math.round((summary.verified / summary.total) * 100)}% verified`
            : "0% verified"
        setStats({
          total: String(summary.total),
          active: String(summary.active),
          suspended: String(summary.suspended),
          verified: String(summary.verified),
          activePercent,
          verifiedPercent,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setStats({
            total: "0",
            active: "0",
            suspended: "0",
            verified: "0",
            activePercent: "0% active",
            verifiedPercent: "0% verified",
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
  }, [tab.role, refreshKey])

  if (isLoading) {
    return <StatCardsSkeleton variant="customer" />
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <CustomerStatCard
        label={tab.statsLabel}
        value={stats.total}
        sublabel={showCustomerMetrics ? "Registered users" : "All accounts"}
      />
      <CustomerStatCard label="Active" value={stats.active} sublabel={stats.activePercent} />
      <CustomerStatCard
        label="Suspended"
        value={stats.suspended}
        sublabel="Inactive accounts"
        sublabelClassName="text-destructive"
      />
      {showCustomerMetrics ? (
        <CustomerStatCard
          label="Avg Order/Users"
          value="0"
          sublabel="0 avg per user"
          sublabelClassName="text-muted-foreground"
        />
      ) : (
        <CustomerStatCard
          label="Email Verified"
          value={stats.verified}
          sublabel={stats.verifiedPercent}
          sublabelClassName="text-[#2D5A27]"
        />
      )}
    </div>
  )
}
