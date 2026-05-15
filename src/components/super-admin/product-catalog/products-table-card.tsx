"use client"

import { useCallback, useState } from "react"

import { ProductsTable } from "@/components/super-admin/product-catalog/products-table"
import { ProductsToolbar } from "@/components/super-admin/product-catalog/products-toolbar"
import { AdminTableCard } from "@/components/super-admin/shared/admin-table-card"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch"
import {
  fetchProductsPage,
  type ProductFilters,
} from "@/lib/super-admin-table-api"

const defaultFilters: ProductFilters = {
  category: "all",
  status: "all",
  vendor: "all",
  search: "",
}

const PRODUCT_TABLE_COLUMNS = 8

export function ProductsTableCard() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters)
  const fetchPage = useCallback(fetchProductsPage, [])

  const { items, currentPage, totalPages, setCurrentPage, isInitialLoading } =
    usePaginatedFetch(fetchPage, filters)

  const showSkeleton = isInitialLoading && items.length === 0

  return (
    <AdminTableCard>
      <ProductsToolbar filters={filters} onFiltersChange={setFilters} />
      {showSkeleton ? (
        <AdminTableSkeleton columns={PRODUCT_TABLE_COLUMNS} />
      ) : (
        <ProductsTable products={items} />
      )}
      {!showSkeleton && (
        <div className="px-5 pb-4">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </AdminTableCard>
  )
}
