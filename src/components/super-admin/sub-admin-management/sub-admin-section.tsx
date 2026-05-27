"use client"

import { useQuery } from "@tanstack/react-query"

import { CustomerAvatar } from "@/components/super-admin/customer-management/customer-avatar"
import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import { cn } from "@/lib/utils"

const ROLE_BADGE_STYLES: Record<SuperAdminUserListRole, string> = {
  user: "bg-[#E3F2FD] text-[#1565C0]",
  admin: "bg-[#DBEAFE] text-[#1D4ED8]",
  aggregator: "bg-[#E8F5E9] text-[#2D5A27]",
  logistics: "bg-[#FFF3E0] text-[#E65100]",
  super_admin: "bg-[#F3E5F5] text-[#7B1FA2]",
}

const ROLE_LABELS: Record<SuperAdminUserListRole, string> = {
  user: "USER",
  admin: "ADMIN",
  aggregator: "AGGREGATOR",
  logistics: "LOGISTICS",
  super_admin: "SUPER ADMIN",
}

type SubAdminSectionProps = {
  title?: string
  role: SuperAdminUserListRole
  queryKey: readonly unknown[]
  queryFn: () => Promise<Customer[]>
  headerAction?: React.ReactNode
  noCard?: boolean
  onPromote?: (user: Customer) => void
  promotingId?: string | null
  onDeactivate?: (user: Customer) => void
  deactivatingId?: string | null
}

function SubAdminRows({
  role,
  users,
  isLoading,
  error,
  emptyLabel,
  onPromote,
  promotingId,
  onDeactivate,
  deactivatingId,
}: {
  role: SuperAdminUserListRole
  users: Customer[]
  isLoading: boolean
  error: string | null
  emptyLabel: string
  onPromote?: (user: Customer) => void
  promotingId?: string | null
  onDeactivate?: (user: Customer) => void
  deactivatingId?: string | null
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="py-4 text-sm text-destructive">{error}</p>
  }

  if (users.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">No {emptyLabel} found.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <article
          key={user.id}
          className="rounded-xl border border-[#E8E8E8] bg-white px-4 py-4 sm:px-5"
        >
          <div className="grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] xl:gap-6">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <CustomerAvatar
                initials={user.initials}
                color={user.avatarColor}
                textColor={user.avatarTextColor}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#111827]">{user.name}</p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                      ROLE_BADGE_STYLES[role]
                    )}
                  >
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-[#9CA3AF]">{user.email}</p>
              </div>
            </div>

            <p className="whitespace-nowrap text-sm text-[#9CA3AF] xl:text-center">
              Added {user.joined}
            </p>

            <span
              className={cn(
                "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
                user.status === "active"
                  ? "bg-[#E8F5E9] text-[#2D5A27]"
                  : "bg-red-50 text-red-600"
              )}
            >
              {user.status === "active" ? "Active" : "Inactive"}
            </span>

            {role === "admin" && onPromote ? (
              <button
                type="button"
                disabled={!!promotingId}
                onClick={() => onPromote(user)}
                className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#2D5A27]/30 bg-white px-4 text-xs font-medium text-[#2D5A27] transition-colors hover:bg-[#F0FDF4] disabled:opacity-50"
              >
                {promotingId === user.id ? "Promoting…" : "Promote"}
              </button>
            ) : null
            /* <button
                type="button"
                className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#E8E8E8] bg-white px-4 text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
              >
                Edit Permission
              </button> */}

            <button
              type="button"
              disabled={!!deactivatingId}
              onClick={() => onDeactivate?.(user)}
              className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#FECACA] bg-[#FDECEC] px-4 text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FCE4E4] disabled:opacity-50"
            >
              {deactivatingId === user.id ? "Deactivating…" : "Deactivate"}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export function SubAdminSection({
  title,
  role,
  queryKey,
  queryFn,
  headerAction,
  noCard = false,
  onPromote,
  promotingId,
  onDeactivate,
  deactivatingId,
}: SubAdminSectionProps) {
  const { data: users = [], isLoading, error } = useQuery({ queryKey, queryFn })
  const errorMessage = error instanceof Error ? error.message : error ? "Failed to load users." : null

  const rows = (
    <SubAdminRows
      role={role}
      users={users}
      isLoading={isLoading}
      error={errorMessage}
      emptyLabel={title?.toLowerCase() ?? ROLE_LABELS[role].toLowerCase()}
      onPromote={onPromote}
      promotingId={promotingId}
      onDeactivate={onDeactivate}
      deactivatingId={deactivatingId}
    />
  )

  if (noCard) return rows

  return (
    <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
      {(title || headerAction) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>}
          {headerAction}
        </div>
      )}
      {rows}
    </section>
  )
}
