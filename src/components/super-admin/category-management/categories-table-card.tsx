"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { CategoriesTable } from "@/components/super-admin/category-management/categories-table"
import { CategoriesToolbar } from "@/components/super-admin/category-management/categories-toolbar"
import { CategoryFormModal } from "@/components/super-admin/category-management/category-form-modal"
import { DeleteCategoryDialog } from "@/components/super-admin/category-management/delete-category-dialog"
import { AdminTableSkeleton } from "@/components/super-admin/shared/admin-table-skeleton"
import { TablePagination } from "@/components/super-admin/shared/table-pagination"
import { useCategoriesMutations } from "@/hooks/use-categories-mutations"
import { categoryQueryKeys } from "@/lib/category-query-keys"
import { ADMIN_TABLE_PAGE_SIZE, getTotalPages } from "@/lib/pagination"
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
  addModalOpen?: boolean
  onAddModalOpenChange?: (open: boolean) => void
}

export function CategoriesTableCard({
  addModalOpen = false,
  onAddModalOpenChange,
}: CategoriesTableCardProps) {
  const [filters, setFilters] = useState<CategoryFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [editCategory, setEditCategory] = useState<CategoryRow | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CategoryRow | null>(null)

  const { createCategory, updateCategory, deleteCategory: removeCategory, isLoading } =
    useCategoriesMutations()

  const { data, isLoading: isInitialLoading, error } = useQuery({
    queryKey: categoryQueryKeys.list({ page: currentPage, ...filters }),
    queryFn: () => fetchCategoriesPage(currentPage, filters),
    placeholderData: (prev) => prev,
  })

  const items = data?.items ?? []
  const totalCount = data?.total ?? 0
  const totalPages = getTotalPages(totalCount, ADMIN_TABLE_PAGE_SIZE)
  const showSkeleton = isInitialLoading && items.length === 0
  const fetchError = error instanceof Error ? error.message : null

  const handleFiltersChange = (next: CategoryFilters) => {
    setFilters(next)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
        <CategoriesToolbar filters={filters} onFiltersChange={handleFiltersChange} />

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
              totalItems={totalCount}
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
        }}
      />

      <CategoryFormModal
        open={!!editCategory}
        onOpenChange={(open) => { if (!open) setEditCategory(null) }}
        mode="edit"
        category={editCategory}
        isSubmitting={isLoading}
        onSubmit={async (name) => {
          if (!editCategory) return
          await updateCategory(editCategory.id, name)
          setEditCategory(null)
        }}
      />

      <DeleteCategoryDialog
        open={!!deleteCategory}
        onOpenChange={(open) => { if (!open) setDeleteCategory(null) }}
        category={deleteCategory}
        isDeleting={isLoading}
        onConfirm={async () => {
          if (!deleteCategory) return
          await removeCategory(deleteCategory.id)
          setDeleteCategory(null)
        }}
      />
    </>
  )
}
