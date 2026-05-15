"use client"

import { FilterDropdown } from "@/components/super-admin/shared/filter-dropdown"
import { SearchInput } from "@/components/super-admin/shared/search-input"
import type { CustomerFilters } from "@/lib/super-admin-table-api"
import type { UserManagementTab } from "@/lib/super-admin-user-list"

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
}

export function CustomersToolbar({ tab, filters, onFiltersChange }: CustomersToolbarProps) {
  return (
    <div className="border-b border-[#EBEBEB] px-6 pb-5 pt-6">
      <h2 className="text-base font-semibold leading-none text-foreground">{tab.tableTitle}</h2>

      <div className="mt-4 flex items-center gap-3">
        <SearchInput
          placeholder="Search by name, email, or phone"
          value={filters.search}
          onChange={(search) => onFiltersChange({ ...filters, search })}
          inputClassName="rounded-lg border-[#E8E8E8]"
        />

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <FilterDropdown
            value={filters.status}
            options={statusOptions}
            onValueChange={(status) => onFiltersChange({ ...filters, status })}
            className="h-10 w-[148px] shrink-0 rounded-lg border-[#E8E8E8] px-4"
          />
          <FilterDropdown
            value={filters.dateRange}
            options={dateOptions}
            onValueChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
            className="h-10 w-[148px] shrink-0 rounded-lg border-[#E8E8E8] px-4"
          />
        </div>
      </div>
    </div>
  )
}
