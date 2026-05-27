"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import { categoryQueryKeys } from "@/lib/category-query-keys"
import { categoriesService } from "@/services/categories"

export function useCategoriesMutations() {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })

  const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (name: string) => categoriesService.create({ category_name: name }),
    onSuccess: (res) => { toast.success(res.message ?? "Category created successfully"); invalidate() },
    onError: (err: unknown) => { const m = getApiErrorToastMessage(err, "Failed to create category"); if (m) toast.error(m) },
  })

  const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      categoriesService.update(id, { category_name: name }),
    onSuccess: (res) => { toast.success(res.message ?? "Category updated successfully"); invalidate() },
    onError: (err: unknown) => { const m = getApiErrorToastMessage(err, "Failed to update category"); if (m) toast.error(m) },
  })

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => categoriesService.remove(id),
    onSuccess: (res) => { toast.success(res.message ?? "Category deleted successfully"); invalidate() },
    onError: (err: unknown) => { const m = getApiErrorToastMessage(err, "Failed to delete category"); if (m) toast.error(m) },
  })

  const updateCategoryById = (id: number, name: string) => updateCategory({ id, name })

  return {
    createCategory,
    updateCategory: updateCategoryById,
    deleteCategory,
    isLoading: isCreating || isUpdating || isDeleting,
  }
}
