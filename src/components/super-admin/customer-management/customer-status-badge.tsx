import { cn } from "@/lib/utils"

import type { CustomerStatus } from "@/components/super-admin/customer-management/mock-customers"

type CustomerStatusBadgeProps = {
  status: CustomerStatus
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const isActive = status === "active"

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        isActive
          ? "bg-[#E8F5E9] text-[#2D5A27]"
          : "bg-red-50 text-red-600"
      )}
    >
      {isActive ? "Active" : "Suspended"}
    </span>
  )
}
