"use client"

import { useState } from "react"

import type { DashboardTimePeriod } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { VendorKpiCard } from "@/components/super-admin/vendor-portal/vendor-kpi-card"
import { ActiveVendorsGrid } from "@/components/super-admin/vendor-portal/active-vendors-grid"
import {
  vendorPortalSubtitle,
  vendorSummaryStats,
} from "@/components/super-admin/vendor-portal/mock-vendor-data"
import { PendingVendorsTable } from "@/components/super-admin/vendor-portal/pending-vendors-table"
import { VendorPortalHeaderActions } from "@/components/super-admin/vendor-portal/vendor-portal-header-actions"

export function VendorPortalPage() {
  const [period, setPeriod] = useState<DashboardTimePeriod>("week")

  return (
    <SuperAdminLayout
      title="Farmer / Vendor Portal"
      subtitle={vendorPortalSubtitle}
      headerActions={
        <VendorPortalHeaderActions period={period} onPeriodChange={setPeriod} />
      }
      showNotifications={false}
    >
      <div className="flex flex-col gap-5 pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vendorSummaryStats.map((stat) => (
            <VendorKpiCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={"trend" in stat ? stat.trend : undefined}
              trendClassName={"trendClassName" in stat ? stat.trendClassName : undefined}
              sublabel={"sublabel" in stat ? stat.sublabel : undefined}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          <ActiveVendorsGrid />
          <PendingVendorsTable />
        </div>
      </div>
    </SuperAdminLayout>
  )
}
