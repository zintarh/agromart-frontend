"use client"

import { useQuery } from "@tanstack/react-query"

import { CustomerStatCard } from "@/components/super-admin/customer-management/customer-stat-card"
import { customerStats } from "@/components/super-admin/customer-management/mock-customers"
import { StatCardsSkeleton } from "@/components/super-admin/shared/stat-cards-skeleton"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import { mapSuperAdminUserToCustomer } from "@/lib/map-super-admin-user-to-customer"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"
import { superAdminUsersService } from "@/services/super-admin-users"

type CustomerStatsGridProps = {
  tab: UserManagementTab
}

export function CustomerStatsGrid({ tab }: CustomerStatsGridProps) {
  const showCustomerMetrics = isCustomerTab(tab)

  const { data: users = [], isLoading } = useQuery({
    queryKey: superAdminQueryKeys.users.byRole(tab.role),
    queryFn: async () => {
      const list = await superAdminUsersService.listByRole(tab.role)
      return list.map((u, i) => mapSuperAdminUserToCustomer(u, i))
    },
  })

  if (isLoading && users.length === 0) {
    return <StatCardsSkeleton variant="customer" />
  }

  const total = users.length
  const active = users.filter((u) => u.status === "active").length
  const suspended = total - active
  const verified = users.filter((u) => u.emailVerified).length

  const activePercent = total > 0
    ? `${Math.round((active / total) * 100)}% active`
    : customerStats.active.sublabel
  const verifiedPercent = total > 0
    ? `${Math.round((verified / total) * 100)}% verified`
    : "0% verified"

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CustomerStatCard
        label={showCustomerMetrics ? "Total Customer" : tab.statsLabel}
        value={String(total)}
        sublabel={showCustomerMetrics ? customerStats.total.sublabel : "Registered users"}
      />
      <CustomerStatCard
        label="Active"
        value={String(active)}
        sublabel={showCustomerMetrics ? activePercent : customerStats.active.sublabel}
      />
      <CustomerStatCard
        label="Suspended"
        value={String(suspended)}
        sublabel={showCustomerMetrics ? customerStats.suspended.sublabel : "Inactive accounts"}
        sublabelClassName={
          showCustomerMetrics ? customerStats.suspended.sublabelClassName : "text-destructive"
        }
      />
      {showCustomerMetrics ? (
        <CustomerStatCard
          label="Avg Order/Users"
          value={customerStats.avgOrders.value}
          sublabel={customerStats.avgOrders.sublabel}
          sublabelClassName={customerStats.avgOrders.sublabelClassName}
        />
      ) : (
        <CustomerStatCard
          label="Email Verified"
          value={String(verified)}
          sublabel={verifiedPercent}
          sublabelClassName="text-[#2D5A27]"
        />
      )}
    </div>
  )
}
