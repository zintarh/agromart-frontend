"use client"

import { useState } from "react"

import { CustomerStatsGrid } from "@/components/super-admin/customer-management/customer-stats-grid"
import { CustomersTableCard } from "@/components/super-admin/customer-management/customers-table-card"
import { UserRoleTabs } from "@/components/super-admin/customer-management/user-role-tabs"
import { InviteUserButton } from "@/components/super-admin/invite-user/invite-user-button"
import { CustomerPageActions } from "@/components/super-admin/shared/customer-page-actions"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import {
  DEFAULT_USER_MANAGEMENT_TAB,
  getUserManagementTab,
  type UserManagementTabId,
} from "@/lib/super-admin-user-list"
import { invalidateSuperAdminUsersCache } from "@/lib/super-admin-users-cache"
import { Route } from "@/routes/admin/users/index"

export function CustomerManagementPage() {
  const { tab: tabParam } = Route.useSearch()
  const navigate = Route.useNavigate()
  const activeTab = getUserManagementTab(tabParam ?? DEFAULT_USER_MANAGEMENT_TAB)
  const [refreshToken, setRefreshToken] = useState(0)

  const handleTabChange = (tabId: UserManagementTabId) => {
    void navigate({ search: { tab: tabId } })
  }

  const handleMutated = () => {
    invalidateSuperAdminUsersCache(activeTab.role)
    setRefreshToken((token) => token + 1)
  }

  const subtitle =
    activeTab.id === "customers"
      ? "All registered customers"
      : `Manage ${activeTab.label.toLowerCase()}`

  return (
    <SuperAdminLayout
      title="User Management"
      subtitle={subtitle}
      headerActions={<InviteUserButton activeTabId={activeTab.id} onSuccess={handleMutated} />}
    >
      <div className="flex flex-col gap-5">
        <CustomerStatsGrid tab={activeTab} refreshKey={refreshToken} />

        <UserRoleTabs value={activeTab.id} onChange={handleTabChange} />

        <CustomerPageActions activeTabId={activeTab.id} onInviteSuccess={handleMutated} />

        <CustomersTableCard
          key={`${activeTab.id}-${refreshToken}`}
          tab={activeTab}
          refreshToken={refreshToken}
          onMutated={handleMutated}
        />
      </div>
    </SuperAdminLayout>
  )
}
