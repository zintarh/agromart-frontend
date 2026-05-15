"use client"

import {
  DEFAULT_USER_MANAGEMENT_TAB,
  USER_MANAGEMENT_TABS,
  type UserManagementTabId,
} from "@/lib/super-admin-user-list"
import { cn } from "@/lib/utils"

type UserRoleTabsProps = {
  value?: UserManagementTabId
  onChange: (tab: UserManagementTabId) => void
}

export function UserRoleTabs({ value = DEFAULT_USER_MANAGEMENT_TAB, onChange }: UserRoleTabsProps) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap gap-0.5 overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-0.5"
      role="tablist"
      aria-label="User types"
    >
      {USER_MANAGEMENT_TABS.map((tab) => {
        const isActive = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "h-8 rounded-md px-3 text-xs font-medium transition-colors",
              isActive
                ? "bg-[#2D5A27] text-white"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
