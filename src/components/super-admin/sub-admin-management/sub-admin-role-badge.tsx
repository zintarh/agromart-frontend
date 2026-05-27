import {
  subAdminRoleLabels,
  type SubAdminRoleId,
} from "@/components/super-admin/sub-admin-management/mock-sub-admin-data"
import { cn } from "@/lib/utils"

const roleStyles: Record<SubAdminRoleId, string> = {
  user_admin: "bg-[#DBEAFE] text-[#1D4ED8]",
  farmer_vendor_admin: "bg-[#E8F5E9] text-[#2D5A27]",
}

type SubAdminRoleBadgeProps = {
  roleId: SubAdminRoleId
  className?: string
}

export function SubAdminRoleBadge({ roleId, className }: SubAdminRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        roleStyles[roleId],
        className
      )}
    >
      {subAdminRoleLabels[roleId]}
    </span>
  )
}
