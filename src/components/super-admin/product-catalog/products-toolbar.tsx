"use client"

import { useEffect, useState } from "react"

import { FilterDropdown } from "@/components/super-admin/shared/filter-dropdown"
import { SearchInput } from "@/components/super-admin/shared/search-input"
import { fetchProductCategoryFilterOptions } from "@/lib/products-table-api"
import type { ProductFilters } from "@/lib/product-catalog-types"

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

type ProductsToolbarProps = {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductsToolbar({ filters, onFiltersChange }: ProductsToolbarProps) {
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "all", label: "All Categories" },
  ])

  useEffect(() => {
    void fetchProductCategoryFilterOptions().then(setCategoryOptions).catch(() => {})
  }, [])

  return (
    <div className="border-b border-border px-5 py-4">
      <p className="mb-3 text-sm font-semibold text-foreground">All products</p>
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          placeholder="Search products by name or category"
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
      </div>
    </div>
  )
}
