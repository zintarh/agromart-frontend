"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import { categoriesService } from "@/services/categories"
import type { LoadingState } from "@/types/loading"

export function useCategoriesMutations() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")

  const createCategory = useCallback(async (categoryName: string) => {
    setLoadingState("loading")
    try {
      const response = await categoriesService.create({ category_name: categoryName })
      toast.success(response.message ?? "Category created successfully")
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to create category")
      if (message) toast.error(message)
      setLoadingState("error")
      throw err
    } finally {
      setLoadingState("idle")
    }
  }, [])

  const updateCategory = useCallback(async (id: number, categoryName: string) => {
    setLoadingState("loading")
    try {
      const response = await categoriesService.update(id, { category_name: categoryName })
      toast.success(response.message ?? "Category updated successfully")
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to update category")
      if (message) toast.error(message)
      setLoadingState("error")
      throw err
    } finally {
      setLoadingState("idle")
    }
  }, [])

  const deleteCategory = useCallback(async (id: number) => {
    setLoadingState("loading")
    try {
      const response = await categoriesService.remove(id)
      toast.success(response.message ?? "Category deleted successfully")
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to delete category")
      if (message) toast.error(message)
      setLoadingState("error")
      throw err
    } finally {
      setLoadingState("idle")
    }
  }, [])

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading: loadingState === "loading",
  }
}
