"use client"

import { useState } from "react"

import { DashboardHeaderActions } from "@/components/super-admin/dashboard/dashboard-header-actions"
import { DashboardSummaryCards } from "@/components/super-admin/dashboard/dashboard-summary-cards"
import {
  dashboardKpis,
  dashboardSubtitle,
  type DashboardTimePeriod,
} from "@/components/super-admin/dashboard/mock-dashboard-data"
import { OrderStatusChartCard } from "@/components/super-admin/dashboard/order-status-chart-card"
import { RecentOrdersCard } from "@/components/super-admin/dashboard/recent-orders-card"
import { RevenueChartCard } from "@/components/super-admin/dashboard/revenue-chart-card"
import { SalesByCategoryCard } from "@/components/super-admin/dashboard/sales-by-category-card"
import { TopProductsCard } from "@/components/super-admin/dashboard/top-products-card"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { KpiStatCard } from "@/components/super-admin/shared/kpi-stat-card"
import { KpiStatCardsSkeleton } from "@/components/super-admin/shared/kpi-stat-cards-skeleton"
import { useSuperAdminPageLoading } from "@/hooks/use-super-admin-page-loading"

export function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState<DashboardTimePeriod>("week")
  const isLoading = useSuperAdminPageLoading()

  return (
    <SuperAdminLayout
      title="Analytics Dashboard"
      subtitle={dashboardSubtitle}
      headerActions={
        <DashboardHeaderActions period={period} onPeriodChange={setPeriod} />
      }
      showNotifications={false}
    >
      <div className="flex flex-col gap-5 pb-2">
        {isLoading ? (
          <KpiStatCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardKpis.map((kpi) => (
              <KpiStatCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                trend={kpi.trend}
                sublabel={kpi.sublabel}
                sublabelClassName={kpi.sublabelClassName}
                to={kpi.to}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <RevenueChartCard isLoading={isLoading} />
          <OrderStatusChartCard isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RecentOrdersCard isLoading={isLoading} />
          <TopProductsCard isLoading={isLoading} />
        </div>

        <SalesByCategoryCard isLoading={isLoading} />
        <DashboardSummaryCards isLoading={isLoading} />
      </div>
    </SuperAdminLayout>
  )
}
