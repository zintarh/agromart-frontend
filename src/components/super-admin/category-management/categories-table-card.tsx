"use client"

import { useCallback, useState } from "react"

import { CategoriesTable } from "@/components/super-admin/category-management/categories-table"
import { CategoriesToolbar } from "@/components/super-admin/category-management/categories-toolbar"
import { CategoryFormModal } from "@/components/super-admin/category-management/category-form-modal"
import { DeleteCategoryDialog } from "@/components/super-admin/category-management/delete-category-dialog"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { useCategoriesMutations } from "@/hooks/use-categories-mutations"
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch"
import {
  fetchCategoriesPage,
  type CategoryFilters,
  type CategoryRow,
} from "@/lib/categories-table-api"

const defaultFilters: CategoryFilters = {
  search: "",
  sortOrder: "desc",
}

const CATEGORY_TABLE_COLUMNS = 5

type CategoriesTableCardProps = {
  refreshToken?: number
  addModalOpen?: boolean
  onAddModalOpenChange?: (open: boolean) => void
  onMutated?: () => void
}

export function CategoriesTableCard({
  refreshToken = 0,
  addModalOpen = false,
  onAddModalOpenChange,
  onMutated,
}: CategoriesTableCardProps) {
  const [filters, setFilters] = useState<CategoryFilters>(defaultFilters)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState<CategoryRow | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CategoryRow | null>(null)

  const { createCategory, updateCategory, deleteCategory: removeCategory, isLoading } =
    useCategoriesMutations()

  const fetchPage = useCallback(async (page: number, activeFilters: CategoryFilters) => {
    try {
      setFetchError(null)
      return await fetchCategoriesPage(page, activeFilters)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load categories. Please try again."
      setFetchError(message)
      return { items: [], total: 0 }
    }
  }, [])

  const { items, currentPage, totalPages, setCurrentPage, isInitialLoading } = usePaginatedFetch(
    fetchPage,
    filters,
    refreshToken
  )

  const showSkeleton = isInitialLoading && items.length === 0 && !fetchError

  const handleMutated = () => {
    onMutated?.()
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
        <CategoriesToolbar filters={filters} onFiltersChange={setFilters} />

        {fetchError && (
          <p className="mx-6 mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {fetchError}
          </p>
        )}

        {showSkeleton ? (
          <AdminTableSkeleton columns={CATEGORY_TABLE_COLUMNS} />
        ) : items.length === 0 && !fetchError ? (
          <p className="px-6 py-10 text-sm text-muted-foreground">No categories found.</p>
        ) : (
          <CategoriesTable
            categories={items}
            onEdit={setEditCategory}
            onDelete={setDeleteCategory}
          />
        )}

        {!showSkeleton && totalPages > 0 && (
          <div className="px-6 pb-6 pt-2">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <CategoryFormModal
        open={addModalOpen}
        onOpenChange={(open) => onAddModalOpenChange?.(open)}
        mode="create"
        isSubmitting={isLoading}
        onSubmit={async (name) => {
          await createCategory(name)
          handleMutated()
        }}
      />

      <CategoryFormModal
        open={!!editCategory}
        onOpenChange={(open) => {
          if (!open) setEditCategory(null)
        }}
        mode="edit"
        category={editCategory}
        isSubmitting={isLoading}
        onSubmit={async (name) => {
          if (!editCategory) return
          await updateCategory(editCategory.id, name)
          setEditCategory(null)
          handleMutated()
        }}
      />

      <DeleteCategoryDialog
        open={!!deleteCategory}
        onOpenChange={(open) => {
          if (!open) setDeleteCategory(null)
        }}
        category={deleteCategory}
        isDeleting={isLoading}
        onConfirm={async () => {
          if (!deleteCategory) return
          await removeCategory(deleteCategory.id)
          setDeleteCategory(null)
          handleMutated()
        }}
      />
    </>
  )
}
