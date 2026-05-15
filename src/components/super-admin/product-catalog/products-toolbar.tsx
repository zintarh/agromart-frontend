"use client"

import { FilterDropdown } from "@/components/super-admin/shared/filter-dropdown"
import { SearchInput } from "@/components/super-admin/shared/search-input"
import type { ProductFilters } from "@/lib/super-admin-table-api"

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Vegetable", label: "Vegetable" },
  { value: "Fruit", label: "Fruit" },
  { value: "Grains", label: "Grains" },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
]

const vendorOptions = [
  { value: "all", label: "All Vendors" },
  { value: "GreenField Farm", label: "GreenField Farm" },
  { value: "Sunrise Agro", label: "Sunrise Agro" },
  { value: "Harvest Co-op", label: "Harvest Co-op" },
]

type ProductsToolbarProps = {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductsToolbar({ filters, onFiltersChange }: ProductsToolbarProps) {
  return (
    <div className="border-b border-border px-5 py-4">
      <p className="mb-3 text-sm font-semibold text-foreground">All product</p>
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder="Search products by name, category, or vendor"
          value={filters.search}
          onChange={(search) => onFiltersChange({ ...filters, search })}
        />
        <FilterDropdown
          value={filters.category}
          options={categoryOptions}
          onValueChange={(category) => onFiltersChange({ ...filters, category })}
        />
        <FilterDropdown
          value={filters.status}
          options={statusOptions}
          onValueChange={(status) => onFiltersChange({ ...filters, status })}
        />
        <FilterDropdown
          value={filters.vendor}
          options={vendorOptions}
          onValueChange={(vendor) => onFiltersChange({ ...filters, vendor })}
        />
      </div>
    </div>
  )
}
