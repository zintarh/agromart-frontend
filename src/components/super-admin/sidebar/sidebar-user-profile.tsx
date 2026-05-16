"use client"

import {
  getAdminDisplayName,
  getAdminInitials,
  getAdminRoleLabel,
} from "@/types/admin-user"
import { useAdminUser } from "@/store/adminStore"

export function SidebarUserProfile() {
  const user = useAdminUser()

  const displayName = getAdminDisplayName(user)
  const initials = getAdminInitials(user)
  const roleLabel = getAdminRoleLabel(user)
  const email = user?.email ?? ""

  return (
    <div className="flex items-center gap-3 border-t border-border px-4 py-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2D5A27] text-sm font-semibold text-white"
        aria-hidden
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
        {user ? (
          <p className="truncate text-[10px] font-medium tracking-wide text-muted-foreground/80 uppercase">
            {roleLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}
