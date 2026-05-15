"use client"

import { Link } from "@tanstack/react-router"
import { Bell, Plus } from "lucide-react"

import type { DashboardTimePeriod } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { TimePeriodToggle } from "@/components/super-admin/shared/time-period-toggle"
import { dashboardLinks } from "@/lib/dashboard-links"
import { Button } from "@/components/ui/button"

type DashboardHeaderActionsProps = {
  period: DashboardTimePeriod
  onPeriodChange: (period: DashboardTimePeriod) => void
}

export function DashboardHeaderActions({
  period,
  onPeriodChange,
}: DashboardHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TimePeriodToggle value={period} onChange={onPeriodChange} />
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-1 rounded-lg border-[#E8E8E8] bg-white px-4 text-sm font-medium text-foreground shadow-none hover:bg-white"
      >
        <Plus className="size-4" strokeWidth={2} />
        Export
      </Button>
      <Link
        to={dashboardLinks.notifications}
        aria-label="Notifications"
        className="relative flex size-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-foreground transition-colors hover:bg-muted/50"
      >
        <Bell className="size-5" strokeWidth={1.75} />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
      </Link>
    </div>
  )
}
