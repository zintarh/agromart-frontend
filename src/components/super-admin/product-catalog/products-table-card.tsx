"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { keepPreviousData } from "@tanstack/react-query"

import { DeleteProductDialog } from "@/components/super-admin/product-catalog/delete-product-dialog"
import { RejectProductDialog } from "@/components/super-admin/product-catalog/reject-product-dialog"
import { ProductsTable } from "@/components/super-admin/product-catalog/products-table"
import { ProductsToolbar } from "@/components/super-admin/product-catalog/products-toolbar"
import { AdminTableCard } from "@/components/super-admin/shared/admin-table-card"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { useDeleteProduct } from "@/hooks/use-delete-product"
import { useProductReview } from "@/hooks/use-product-review"
import type { CatalogProduct, ProductFilters } from "@/lib/product-catalog-types"
import { productQueryKeys } from "@/lib/product-query-keys"
import { fetchProductsPage } from "@/lib/products-table-api"
import { getTotalPages } from "@/lib/pagination"

const defaultFilters: ProductFilters = {
  category: "all",
  status: "all",
  search: "",
}

const PRODUCT_TABLE_COLUMNS = 6

export function ProductsTableCard() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteProduct, setDeleteProduct] = useState<CatalogProduct | null>(null)
  const [rejectProduct, setRejectProduct] = useState<CatalogProduct | null>(null)

  const { deleteProduct: removeProduct, isDeleting } = useDeleteProduct()
  const { approve, reject, approvingId, rejectingId } = useProductReview()

  const { data, isLoading } = useQuery({
    queryKey: productQueryKeys.list(currentPage, filters),
    queryFn: () => fetchProductsPage(currentPage, filters),
    placeholderData: keepPreviousData,
  })

  const items = data?.items ?? []
  const totalCount = data?.total ?? 0
  const totalPages = getTotalPages(totalCount, 10)
  const showSkeleton = isLoading && items.length === 0

  const handleFiltersChange = (next: ProductFilters) => {
    setFilters(next)
    setCurrentPage(1)
  }

  return (
    <>
      <AdminTableCard>
        <ProductsToolbar filters={filters} onFiltersChange={handleFiltersChange} />
        {showSkeleton ? (
          <AdminTableSkeleton columns={PRODUCT_TABLE_COLUMNS} />
        ) : (
          <ProductsTable
            products={items}
            onDelete={setDeleteProduct}
            onApprove={async (product) => {
              await approve(Number(product.id))
            }}
            onReject={setRejectProduct}
            approvingId={approvingId}
            rejectingId={rejectingId}
          />
        )}
        {!showSkeleton && totalPages > 0 && (
          <div className="px-5 pb-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </AdminTableCard>

      <DeleteProductDialog
        open={!!deleteProduct}
        onOpenChange={(open) => { if (!open) setDeleteProduct(null) }}
        product={deleteProduct}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!deleteProduct) return
          await removeProduct(Number(deleteProduct.id))
          setDeleteProduct(null)
        }}
      />

      <RejectProductDialog
        open={!!rejectProduct}
        onOpenChange={(open) => { if (!open) setRejectProduct(null) }}
        product={rejectProduct}
        isRejecting={rejectingId !== null}
        onConfirm={async (reason) => {
          if (!rejectProduct) return
          await reject(Number(rejectProduct.id), reason || undefined)
          setRejectProduct(null)
        }}
      />
    </>
  )
}
