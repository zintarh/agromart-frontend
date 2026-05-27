"use client"

import type { VendorApplicationStatus } from "@/components/super-admin/vendor-applications/mock-vendor-applications"
import { cn } from "@/lib/utils"

export type VendorApplicationTab = {
  id: VendorApplicationStatus
  label: string
  count: number
}

type VendorApplicationStatusTabsProps = {
  tabs: VendorApplicationTab[]
  value: VendorApplicationStatus
  onChange: (status: VendorApplicationStatus) => void
}

export function VendorApplicationStatusTabs({
  tabs,
  value,
  onChange,
}: VendorApplicationStatusTabsProps) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-[#E8E8E8] bg-white p-1"
      role="tablist"
      aria-label="Application status"
    >
      {tabs.map((tab) => {
        const isActive = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#2D5A27] text-white shadow-none"
                : "bg-white text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        )
      })}
    </div>
  )
}
