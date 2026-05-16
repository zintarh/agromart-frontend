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
  onDelete?: (customer: Customer) => void
  isPromoting?: boolean
  promotingUserId?: string | null
  isDeleting?: boolean
  deletingUserId?: string | null
}

const headerClass =
  "h-11 px-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase"

export function CustomersTable({
  customers,
  tab,
  allowUserDetailLinks = true,
  onPromote,
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
        <TableRow className="border-[#EBEBEB] hover:bg-transparent">
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
          <TableHead className={cn(headerClass, "pr-6 pl-4")}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => {
          const isActive = customer.status === "active"
          const isPromotingRow = isPromoting && promotingUserId === customer.id
          const isDeletingRow = isDeleting && deletingUserId === customer.id

          return (
            <TableRow key={customer.id} className="border-[#EBEBEB] hover:bg-transparent">
              <TableCell className="px-6 py-4">
                <UserNameCell
                  customer={customer}
                  allowUserDetailLinks={allowUserDetailLinks}
                />
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                {customer.email}
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                {displaySuperAdminValue(customer.phone)}
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                {customer.joined}
              </TableCell>
              {!showCommerceColumns && (
                <TableCell className="px-4 py-4">
                  <EmailVerifiedBadge verified={!!customer.emailVerified} />
                </TableCell>
              )}
              {showCommerceColumns && (
                <TableCell className="px-4 py-4 text-sm text-foreground">
                  {customer.orders}
                </TableCell>
              )}
              <TableCell className="px-4 py-4">
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
              {showCommerceColumns && (
                <TableCell className="px-4 py-4 text-sm font-semibold text-foreground">
                  {displaySuperAdminValue(customer.totalSpent)}
                </TableCell>
              )}
              <TableCell className="pr-6 pl-4 py-4">
                <div className="flex items-center gap-2">
                  {allowUserDetailLinks ? (
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: customer.id }}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-8 rounded-lg border-[#E8E8E8] bg-white px-3.5 text-xs font-medium text-foreground shadow-none hover:bg-white"
                      )}
                    >
                      View
                    </Link>
                  ) : null}
                  {showPromote ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPromoting}
                      onClick={() => onPromote?.(customer)}
                      className="h-8 rounded-lg border-[#2D5A27]/30 bg-white px-3.5 text-xs font-medium text-[#2D5A27] shadow-none hover:bg-white"
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
                        "h-8 rounded-lg px-3.5 text-xs font-medium shadow-none",
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
      <CustomerAvatar initials={customer.initials} color={customer.avatarColor} />
      <span className="text-sm font-medium text-foreground">{customer.name}</span>
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

