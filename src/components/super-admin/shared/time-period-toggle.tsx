"use client"

import { cn } from "@/lib/utils"

import type { DashboardTimePeriod } from "@/components/super-admin/dashboard/mock-dashboard-data"

type TimePeriodToggleProps = {
  value: DashboardTimePeriod
  onChange: (value: DashboardTimePeriod) => void
}

const options: { value: DashboardTimePeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

export function TimePeriodToggle({ value, onChange }: TimePeriodToggleProps) {
  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-0.5"
      role="group"
      aria-label="Time period"
    >
      {options.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 min-w-[88px] px-4 text-sm font-medium transition-colors",
              isActive
                ? "rounded-md bg-[#2D5A27] text-white"
                : "text-foreground hover:bg-muted/50"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
