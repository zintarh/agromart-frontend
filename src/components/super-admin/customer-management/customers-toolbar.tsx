"use client"

import { Download } from "lucide-react"

import { AddUsersButton } from "@/components/super-admin/customer-management/add-users-button"
import { FilterDropdown } from "@/components/super-admin/shared/filter-dropdown"
import { SearchInput } from "@/components/super-admin/shared/search-input"
import { Button } from "@/components/ui/button"
import type { CustomerFilters } from "@/lib/super-admin-table-api"
import { isCustomerTab, type UserManagementTab } from "@/lib/super-admin-user-list"

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
]

const dateOptions = [
  { value: "all", label: "All Dates" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
]

type CustomersToolbarProps = {
  tab: UserManagementTab
  filters: CustomerFilters
  onFiltersChange: (filters: CustomerFilters) => void
  onInviteSuccess?: () => void
}

export function CustomersToolbar({
  tab,
  filters,
  onFiltersChange,
  onInviteSuccess,
}: CustomersToolbarProps) {
  const showCustomerLayout = isCustomerTab(tab)

  return (
    <div className="border-b border-[#E8E8E8] px-6 pb-5 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-[#111827]">{tab.tableTitle}</h2>
        {showCustomerLayout ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-1.5 rounded-lg border-[#E8E8E8] bg-white px-4 text-sm font-medium text-[#111827] shadow-none hover:bg-[#FAFAFA]"
            >
              Export CSV
              <Download className="size-4 text-[#6B7280]" strokeWidth={2} />
            </Button>
            <AddUsersButton onSuccess={onInviteSuccess} />
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          placeholder={
            showCustomerLayout
              ? "Search order or customer name"
              : "Search by name, email, or phone"
          }
          value={filters.search}
          onChange={(search) => onFiltersChange({ ...filters, search })}
          inputClassName="h-11 rounded-[16px] border-[#E8E8E8]"
        />

        <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
          <FilterDropdown
            value={filters.status}
            options={statusOptions}
            onValueChange={(status) => onFiltersChange({ ...filters, status })}
            className="h-11 w-full min-w-[140px] shrink-0 rounded-[16px] border-[#E8E8E8] px-4 sm:w-[148px]"
          />
          <FilterDropdown
            value={filters.dateRange}
            options={dateOptions}
            onValueChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
            className="h-11 w-full min-w-[140px] shrink-0 rounded-[16px] border-[#E8E8E8] px-4 sm:w-[148px]"
          />
        </div>
      </div>
    </div>
  )
}
