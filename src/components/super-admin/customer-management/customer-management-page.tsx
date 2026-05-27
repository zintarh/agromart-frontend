"use client"

import { CustomerStatsGrid } from "@/components/super-admin/customer-management/customer-stats-grid"
import { CustomersTableCard } from "@/components/super-admin/customer-management/customers-table-card"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import {
  DEFAULT_USER_MANAGEMENT_TAB,
  getUserManagementTab,
} from "@/lib/super-admin-user-list"
import { Route } from "@/routes/admin/users/index"

export function CustomerManagementPage() {
  const { tab: tabParam } = Route.useSearch()
  const activeTab = getUserManagementTab(tabParam ?? DEFAULT_USER_MANAGEMENT_TAB)

  return (
    <SuperAdminLayout
      title="Customer Management"
      subtitle="All registered users"
    >
      <div className="flex flex-col gap-5 pb-6">
        <CustomerStatsGrid tab={activeTab} />
        <CustomersTableCard tab={activeTab} />
      </div>
    </SuperAdminLayout>
  )
}
