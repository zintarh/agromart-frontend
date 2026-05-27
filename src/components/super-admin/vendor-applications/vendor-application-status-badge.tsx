import type { VendorApplicationStatus } from "@/components/super-admin/vendor-applications/mock-vendor-applications"
import { cn } from "@/lib/utils"

const badgeStyles: Record<VendorApplicationStatus, string> = {
  pending: "bg-[#FFF3E0] text-[#E67E22]",
  approved: "bg-[#E8F5E9] text-[#2D5A27]",
  rejected: "bg-[#FFEBEE] text-[#D32F2F]",
}

const badgeLabels: Record<VendorApplicationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
}

type VendorApplicationStatusBadgeProps = {
  status: VendorApplicationStatus
  className?: string
}

export function VendorApplicationStatusBadge({
  status,
  className,
}: VendorApplicationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
        badgeStyles[status],
        className
      )}
    >
      {badgeLabels[status]}
    </span>
  )
}
