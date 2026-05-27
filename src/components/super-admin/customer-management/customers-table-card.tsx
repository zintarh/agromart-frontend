"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal"
import { CustomersTable } from "@/components/super-admin/customer-management/customers-table"
import { CustomersToolbar } from "@/components/super-admin/customer-management/customers-toolbar"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { useDeleteUser } from "@/hooks/use-delete-user"
import { usePromoteAdmin } from "@/hooks/use-promote-admin"
import { canViewPortalUserDetails } from "@/lib/portal-roles"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import { mapSuperAdminUserToCustomer } from "@/lib/map-super-admin-user-to-customer"
import { ADMIN_TABLE_PAGE_SIZE, getTotalPages } from "@/lib/pagination"
import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import type { CustomerFilters } from "@/lib/super-admin-table-api"
import { useAdminUser } from "@/store/adminStore"
import { superAdminUsersService } from "@/services/super-admin-users"

const defaultFilters: CustomerFilters = {
  status: "all",
  dateRange: "all",
  search: "",
}

type CustomersTableCardProps = {
  tab: UserManagementTab
  onMutated?: () => void
}

function filterCustomers(all: Customer[], filters: CustomerFilters): Customer[] {
  let result = all

  if (filters.status !== "all") {
    result = result.filter((c) => c.status === filters.status)
  }

  if (filters.dateRange !== "all") {
    result = result.filter((c) => {
      const date = c.createdAt ?? c.joined
      return date.includes(filters.dateRange)
    })
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }

  return result
}

function getTableColumnCount(tab: UserManagementTab) {
  return isCustomerTab(tab) ? 8 : 7
}

export function CustomersTableCard({ tab, onMutated }: CustomersTableCardProps) {
  const portalUser = useAdminUser()
  const allowUserDetailLinks = canViewPortalUserDetails(portalUser)

  const [filters, setFilters] = useState<CustomerFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<Customer | null>(null)
  const [userToSuspend, setUserToSuspend] = useState<Customer | null>(null)

  const { promote, isPromoting } = usePromoteAdmin()
  const { deleteUser, isDeleting } = useDeleteUser()

  const { data: allUsers = [], isLoading: isInitialLoading } = useQuery({
    queryKey: superAdminQueryKeys.users.byRole(tab.role),
    queryFn: async () => {
      const users = await superAdminUsersService.listByRole(tab.role)
      return users.map((u, i) => mapSuperAdminUserToCustomer(u, i))
    },
  })

  const filteredUsers = useMemo(() => filterCustomers(allUsers, filters), [allUsers, filters])
  const totalCount = filteredUsers.length
  const totalPages = getTotalPages(totalCount, ADMIN_TABLE_PAGE_SIZE)
  const items = useMemo(() => {
    const start = (currentPage - 1) * ADMIN_TABLE_PAGE_SIZE
    return filteredUsers.slice(start, start + ADMIN_TABLE_PAGE_SIZE)
  }, [filteredUsers, currentPage])

  const handleFiltersChange = (next: CustomerFilters) => {
    setFilters(next)
    setCurrentPage(1)
  }

  const showSkeleton = isInitialLoading && allUsers.length === 0

  const handlePromote = async (customer: Customer) => {
    setPromotingUserId(customer.id)
    try {
      await promote(Number(customer.id))
      onMutated?.()
    } finally {
      setPromotingUserId(null)
    }
  }

  const handleConfirmSuspend = async () => {
    if (!userToSuspend) return
    setDeletingUserId(userToSuspend.id)
    try {
      await deleteUser(Number(userToSuspend.id))
      setUserToSuspend(null)
      onMutated?.()
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setDeletingUserId(userToDelete.id)
    try {
      await deleteUser(Number(userToDelete.id))
      onMutated?.()
    } finally {
      setDeletingUserId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
      <CustomersToolbar
        tab={tab}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onInviteSuccess={onMutated}
      />

      {showSkeleton ? (
        <AdminTableSkeleton
          columns={getTableColumnCount(tab)}
          firstColumnWithAvatar
          headerClassName="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        />
      ) : items.length === 0 ? (
        <p className="px-6 py-10 text-sm text-muted-foreground">{tab.emptyMessage}</p>
      ) : (
        <CustomersTable
          customers={items}
          tab={tab}
          allowUserDetailLinks={allowUserDetailLinks}
          onPromote={tab.role === "admin" ? handlePromote : undefined}
          onSuspend={isCustomerTab(tab) ? setUserToSuspend : undefined}
          onDelete={tab.role !== "admin" ? setUserToDelete : undefined}
          isPromoting={isPromoting}
          promotingUserId={promotingUserId}
          isDeleting={isDeleting}
          deletingUserId={deletingUserId}
        />
      )}

      {!showSkeleton && totalPages > 0 && (
        <div className="px-6 pb-6 pt-2">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <DeleteConfirmModal
        open={!!userToSuspend}
        onOpenChange={(open) => { if (!open && !isDeleting) setUserToSuspend(null) }}
        title="Suspend account?"
        description={
          <>
            Are you sure you want to suspend{" "}
            <span className="font-semibold text-foreground">
              {userToSuspend?.name ?? "this account"}
            </span>
            ? They will lose access to the platform until re-enabled.
          </>
        }
        detail={userToSuspend?.email}
        confirmLabel="Suspend"
        confirmingLabel="Suspending…"
        isConfirming={isDeleting}
        onConfirm={handleConfirmSuspend}
      />

      <DeleteConfirmModal
        open={!!userToDelete}
        onOpenChange={(open) => { if (!open && !isDeleting) setUserToDelete(null) }}
        title="Delete user?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {userToDelete?.name ?? "this user"}
            </span>
            ? They will be removed and lose access to the platform.
          </>
        }
        detail={userToDelete?.email}
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
