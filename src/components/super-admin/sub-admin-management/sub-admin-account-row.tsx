import { CustomerAvatar } from "@/components/super-admin/customer-management/customer-avatar"
import { SubAdminRoleBadge } from "@/components/super-admin/sub-admin-management/sub-admin-role-badge"
import type { SubAdminAccount } from "@/components/super-admin/sub-admin-management/mock-sub-admin-data"
import { cn } from "@/lib/utils"

type SubAdminAccountRowProps = {
  account: SubAdminAccount
  onEditPermission?: (account: SubAdminAccount) => void
  onDeactivate?: (account: SubAdminAccount) => void
}

export function SubAdminAccountRow({
  account,
  onEditPermission,
  onDeactivate,
}: SubAdminAccountRowProps) {
  const isActive = account.status === "active"

  return (
    <article className="rounded-xl border border-[#E8E8E8] bg-white px-4 py-4 sm:px-5">
      <div className="grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] xl:gap-6">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <CustomerAvatar
            initials={account.initials}
            color={account.avatarColor}
            textColor={account.avatarTextColor}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#111827]">{account.name}</p>
              <SubAdminRoleBadge roleId={account.roleId} />
            </div>
            <p className="mt-0.5 truncate text-sm text-[#9CA3AF]">{account.email}</p>
          </div>
        </div>

        <p className="whitespace-nowrap text-sm text-[#9CA3AF] xl:text-center">
          Added {account.addedOn}
        </p>

        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
            isActive ? "bg-[#E8F5E9] text-[#2D5A27]" : "bg-red-50 text-red-600"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </span>

        <button
          type="button"
          onClick={() => onEditPermission?.(account)}
          className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#E8E8E8] bg-white px-4 text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
        >
          Edit Permission
        </button>

        <button
          type="button"
          onClick={() => onDeactivate?.(account)}
          className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-[#FECACA] bg-[#FDECEC] px-4 text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FCE4E4]"
        >
          Deactivate
        </button>
      </div>
    </article>
  )
}
