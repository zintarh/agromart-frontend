"use client"

import { FilterDropdown } from "@/components/super-admin/shared/filter-dropdown"
import { SearchInput } from "@/components/super-admin/shared/search-input"
import type { CategoryFilters } from "@/lib/categories-table-api"

const sortOptions = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
]

type CategoriesToolbarProps = {
  filters: CategoryFilters
  onFiltersChange: (filters: CategoryFilters) => void
}

export function CategoriesToolbar({ filters, onFiltersChange }: CategoriesToolbarProps) {
  return (
    <div className="border-b border-[#EBEBEB] px-6 pb-5 pt-6">
      <h2 className="text-base font-semibold leading-none text-foreground">Product Categories</h2>

      <div className="mt-4 flex items-center gap-3">
        <SearchInput
          placeholder="Search by name, slug, or ID"
          value={filters.search}
          onChange={(search) => onFiltersChange({ ...filters, search })}
          inputClassName="rounded-lg border-[#E8E8E8]"
        />

        <div className="ml-auto shrink-0">
          <FilterDropdown
            value={filters.sortOrder}
            options={sortOptions}
            onValueChange={(sortOrder) =>
              onFiltersChange({
                ...filters,
                sortOrder: sortOrder as CategoryFilters["sortOrder"],
              })
            }
            className="h-10 w-[160px] shrink-0 rounded-lg border-[#E8E8E8] px-4"
          />
        </div>
      </div>
    </div>
  )
}
