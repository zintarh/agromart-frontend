import { Link } from "@tanstack/react-router"

import { CustomerAvatar } from "@/components/super-admin/customer-management/customer-avatar"
import { CustomerStatusBadge } from "@/components/super-admin/customer-management/customer-status-badge"
import { EmailVerifiedBadge } from "@/components/super-admin/customer-management/email-verified-badge"
import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { displaySuperAdminValue } from "@/lib/super-admin-display"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"
import { cn } from "@/lib/utils"

type CustomersTableProps = {
  customers: Customer[]
  tab: UserManagementTab
  allowUserDetailLinks?: boolean
  onPromote?: (customer: Customer) => void
  onSuspend?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  isPromoting?: boolean
  promotingUserId?: string | null
  isDeleting?: boolean
  deletingUserId?: string | null
}

const headerClass =
  "h-11 px-5 text-[10px] font-semibold tracking-[0.06em] text-[#9CA3AF] uppercase"

const viewButtonClass = cn(
  buttonVariants({ variant: "outline", size: "sm" }),
  "h-9 min-w-[76px] rounded-lg border-[#E8E8E8] bg-white px-4 text-xs font-medium text-[#111827] shadow-none hover:bg-[#FAFAFA]"
)

export function CustomersTable({
  customers,
  tab,
  allowUserDetailLinks = true,
  onPromote,
  onSuspend,
  onDelete,
  isPromoting = false,
  promotingUserId = null,
  isDeleting = false,
  deletingUserId = null,
}: CustomersTableProps) {
  const showCommerceColumns = isCustomerTab(tab)
  const showPromote = tab.role === "admin"

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#E8E8E8] hover:bg-transparent">
          <TableHead className={headerClass}>User</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Email</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Phone No</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Joined</TableHead>
          {!showCommerceColumns && (
            <TableHead className={cn(headerClass, "px-4")}>Verified</TableHead>
          )}
          {showCommerceColumns && (
            <TableHead className={cn(headerClass, "px-4")}>Order</TableHead>
          )}
          <TableHead className={cn(headerClass, "px-4")}>Status</TableHead>
          {showCommerceColumns && (
            <TableHead className={cn(headerClass, "px-4")}>Total Spent</TableHead>
          )}
          <TableHead className={cn(headerClass, "pr-5 pl-4 text-right")}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => {
          const isActive = customer.status === "active"
          const isPromotingRow = isPromoting && promotingUserId === customer.id
          const isDeletingRow = isDeleting && deletingUserId === customer.id

          return (
            <TableRow key={customer.id} className="border-[#EEEEEE] hover:bg-transparent">
              <TableCell className="px-5 py-4">
                <UserNameCell
                  customer={customer}
                  allowUserDetailLinks={allowUserDetailLinks}
                />
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-[#6B7280]">{customer.email}</TableCell>
              <TableCell className="px-4 py-4 text-sm text-[#6B7280]">
                {displaySuperAdminValue(customer.phone)}
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-[#6B7280]">{customer.joined}</TableCell>
              {!showCommerceColumns && (
                <TableCell className="px-4 py-4">
                  <EmailVerifiedBadge verified={!!customer.emailVerified} />
                </TableCell>
              )}
              {showCommerceColumns && (
                <TableCell className="px-4 py-4 text-sm text-[#111827]">
                  {customer.orders}
                </TableCell>
              )}
              <TableCell className="px-4 py-4">
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
              {showCommerceColumns && (
                <TableCell className="px-4 py-4 text-sm font-bold text-[#111827]">
                  {displaySuperAdminValue(customer.totalSpent)}
                </TableCell>
              )}
              <TableCell className="pr-5 pl-4 py-4">
                <div className="flex flex-col items-end gap-2">
                  {allowUserDetailLinks ? (
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: customer.id }}
                      className={viewButtonClass}
                    >
                      View
                    </Link>
                  ) : null}
                  {showCommerceColumns ? (
                    isActive ? (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onSuspend?.(customer)}
                        className="inline-flex h-9 min-w-[76px] items-center justify-center rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FEE2E2] disabled:opacity-50"
                      >
                        {isDeletingRow ? "Suspending…" : "Suspend"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDelete?.(customer)}
                        className="inline-flex h-9 min-w-[76px] items-center justify-center rounded-lg bg-[#2D5A27] px-4 text-xs font-medium text-white transition-colors hover:bg-[#264B21] disabled:opacity-50"
                      >
                        {isDeletingRow ? "Enabling…" : "Enable"}
                      </button>
                    )
                  ) : showPromote ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPromoting}
                      onClick={() => onPromote?.(customer)}
                      className="h-9 rounded-lg border-[#2D5A27]/30 bg-white px-4 text-xs font-medium text-[#2D5A27] shadow-none hover:bg-white"
                    >
                      {isPromotingRow ? "Promoting…" : "Promote"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isDeleting || !isActive}
                      onClick={() => onDelete?.(customer)}
                      className={cn(
                        "h-9 rounded-lg px-4 text-xs font-medium shadow-none",
                        isActive
                          ? "border-red-200 bg-white text-red-600 hover:bg-white"
                          : "border-[#2D5A27]/30 bg-white text-[#2D5A27] hover:bg-white"
                      )}
                    >
                      {isDeletingRow ? "Deleting…" : isActive ? "Delete" : "Deleted"}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function UserNameCell({
  customer,
  allowUserDetailLinks,
}: {
  customer: Customer
  allowUserDetailLinks: boolean
}) {
  const content = (
    <>
      <CustomerAvatar
        initials={customer.initials}
        color={customer.avatarColor}
        textColor={customer.avatarTextColor}
      />
      <span className="text-sm font-medium text-[#111827]">{customer.name}</span>
    </>
  )

  if (!allowUserDetailLinks) {
    return <div className="flex items-center gap-2.5">{content}</div>
  }

  return (
    <Link
      to="/admin/users/$userId"
      params={{ userId: customer.id }}
      className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
    >
      {content}
    </Link>
  )
}
