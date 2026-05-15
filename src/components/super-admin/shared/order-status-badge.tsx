import { cn } from "@/lib/utils"

import type { OrderHistoryStatus } from "@/components/super-admin/customer-management/mock-customer-profile"

type OrderStatusBadgeProps = {
  status: OrderHistoryStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const isDelivered = status === "delivered"

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
        isDelivered ? "bg-[#E8F5E9] text-[#2D5A27]" : "bg-red-50 text-red-600"
      )}
    >
      {isDelivered ? "Delivered" : "Cancelled"}
    </span>
  )
}
