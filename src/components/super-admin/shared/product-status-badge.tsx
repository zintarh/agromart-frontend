import type { ProductStatus } from "@/api/product-types"
import { cn } from "@/lib/utils"

const statusStyles: Record<ProductStatus, string> = {
  active: "bg-[#E8F5E9] text-[#2D5A27]",
  pending: "bg-[#FFF3E0] text-[#E67E22]",
  rejected: "bg-red-50 text-red-600",
}

const statusLabels: Record<ProductStatus, string> = {
  active: "Active",
  pending: "Pending",
  rejected: "Rejected",
}

type ProductStatusBadgeProps = {
  status: ProductStatus
  className?: string
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
