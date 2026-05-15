"use client"

import { useState } from "react"

import { AddUserForm } from "@/components/super-admin/add-user/add-user-form"
import { CustomerStatsGrid } from "@/components/super-admin/customer-management/customer-stats-grid"
import { CustomersTableCard } from "@/components/super-admin/customer-management/customers-table-card"
import { UserRoleTabs } from "@/components/super-admin/customer-management/user-role-tabs"
import { CustomerPageActions } from "@/components/super-admin/shared/customer-page-actions"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import {
  DEFAULT_USER_MANAGEMENT_TAB,
  getUserManagementTab,
  type UserManagementTabId,
} from "@/lib/super-admin-user-list"
import { invalidateSuperAdminUsersCache } from "@/lib/super-admin-users-cache"
import { Route } from "@/routes/super-admin/users/index"

export function CustomerManagementPage() {
  const { mode, tab: tabParam } = Route.useSearch()
  const navigate = Route.useNavigate()
  const isAddUser = mode === "add-user"
  const activeTab = getUserManagementTab(tabParam ?? DEFAULT_USER_MANAGEMENT_TAB)
  const [refreshToken, setRefreshToken] = useState(0)

  const showList = () => {
    void navigate({ search: { tab: activeTab.id } })
  }

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
      headerActions={
        !isAddUser ? (
          <PrimaryActionButton
            label="Add Users"
            to="/super-admin/users"
            search={{ mode: "add-user", tab: activeTab.id }}
          />
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5">
        <CustomerStatsGrid tab={activeTab} refreshKey={refreshToken} />

        {!isAddUser && (
          <UserRoleTabs value={activeTab.id} onChange={handleTabChange} />
        )}

        <CustomerPageActions
          isAddUser={isAddUser}
          activeTabId={activeTab.id}
        />

        {isAddUser ? (
          <AddUserForm onCancel={showList} />
        ) : (
          <CustomersTableCard
            key={`${activeTab.id}-${refreshToken}`}
            tab={activeTab}
            refreshToken={refreshToken}
            onMutated={handleMutated}
          />
        )}
      </div>
    </SuperAdminLayout>
  )
}
