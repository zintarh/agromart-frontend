"use client"

import { useCallback, useState } from "react"

import { CustomersTable } from "@/components/super-admin/customer-management/customers-table"
import { CustomersToolbar } from "@/components/super-admin/customer-management/customers-toolbar"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { usePromoteAdmin } from "@/hooks/use-promote-admin"
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch"
import {
  fetchCustomersPage,
  type CustomerFilters,
} from "@/lib/super-admin-table-api"
import { invalidateSuperAdminUsersCache } from "@/lib/super-admin-users-cache"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"
import type { Customer } from "@/components/super-admin/customer-management/mock-customers"

const defaultFilters: CustomerFilters = {
  status: "all",
  dateRange: "all",
  search: "",
}

type CustomersTableCardProps = {
  tab: UserManagementTab
  refreshToken?: number
  onMutated?: () => void
}

function getTableColumnCount(tab: UserManagementTab) {
  return isCustomerTab(tab) ? 8 : 7
}

export function CustomersTableCard({
  tab,
  refreshToken = 0,
  onMutated,
}: CustomersTableCardProps) {
  const [filters, setFilters] = useState<CustomerFilters>(defaultFilters)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null)
  const { promote, isPromoting } = usePromoteAdmin()

  const fetchPage = useCallback(
    async (page: number, activeFilters: CustomerFilters) => {
      try {
        setFetchError(null)
        return await fetchCustomersPage(page, activeFilters, tab.role)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load users. Please try again."
        setFetchError(message)
        return { items: [], total: 0 }
      }
    },
    [tab.role]
  )

  const { items, currentPage, totalPages, setCurrentPage, isInitialLoading } =
    usePaginatedFetch(fetchPage, filters, refreshToken)

  const showSkeleton = isInitialLoading && items.length === 0 && !fetchError

  const handlePromote = async (customer: Customer) => {
    setPromotingUserId(customer.id)
    try {
      await promote(Number(customer.id))
      invalidateSuperAdminUsersCache("admin")
      invalidateSuperAdminUsersCache("super_admin")
      onMutated?.()
    } finally {
      setPromotingUserId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
      <CustomersToolbar tab={tab} filters={filters} onFiltersChange={setFilters} />

      {fetchError && (
        <p className="mx-6 mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </p>
      )}

      {showSkeleton ? (
        <AdminTableSkeleton
          columns={getTableColumnCount(tab)}
          firstColumnWithAvatar
          headerClassName="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        />
      ) : items.length === 0 && !fetchError ? (
        <p className="px-6 py-10 text-sm text-muted-foreground">{tab.emptyMessage}</p>
      ) : (
        <CustomersTable
          customers={items}
          tab={tab}
          onPromote={tab.role === "admin" ? handlePromote : undefined}
          isPromoting={isPromoting}
          promotingUserId={promotingUserId}
        />
      )}

      {!showSkeleton && totalPages > 0 && (
        <div className="px-6 pb-6 pt-2">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
