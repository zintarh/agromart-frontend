import { cn } from "@/lib/utils"

import type { RecentOrderRow } from "@/components/super-admin/dashboard/mock-dashboard-data"

type DashboardOrderStatusPillProps = {
  status: RecentOrderRow["status"]
}

const statusStyles: Record<RecentOrderRow["status"], string> = {
  delivered: "bg-[#E8F5E9] text-[#2D5A27]",
  "out-for-delivery": "bg-[#FFF0E6] text-[#E67E22]",
  pending: "bg-[#F1F5F9] text-[#64748B]",
  confirmed: "bg-[#DBEAFE] text-[#2563EB]",
  cancelled: "bg-red-50 text-red-600",
}

const statusLabels: Record<RecentOrderRow["status"], string> = {
  delivered: "Delivered",
  "out-for-delivery": "Out for Del",
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
}

export function DashboardOrderStatusPill({ status }: DashboardOrderStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
