"use client"

import { useQuery } from "@tanstack/react-query"

import { categoryQueryKeys } from "@/lib/category-query-keys"
import { categoriesService } from "@/services/categories"

export type CategoryOption = { value: string; label: string }

export function useAddProductCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: categoryQueryKeys.options(),
    queryFn: async () => {
      const result = await categoriesService.list({ page: 1, limit: 500, sort_order: "asc" })
      return result.items.map((category): CategoryOption => ({
        value: String(category.id),
        label: category.name,
      }))
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    categoryOptions: data ?? [],
    isLoadingCategories: isLoading,
    categoriesError: error instanceof Error ? error.message : null,
  }
}
