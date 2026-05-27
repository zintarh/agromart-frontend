"use client"

import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast, showSuccessToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import { productsService } from "@/services/products"

export function useProductReview() {
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const approve = useCallback(async (id: number) => {
    setApprovingId(id)
    try {
      const response = await productsService.approve(id)
      showSuccessToast(response, "Product approved successfully")
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to approve product")
      if (message) showErrorToast(message)
      throw err
    } finally {
      setApprovingId(null)
    }
  }, [queryClient])

  const reject = useCallback(async (id: number, reason?: string) => {
    setRejectingId(id)
    try {
      const response = await productsService.reject(id, reason)
      showSuccessToast(response, "Product rejected")
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to reject product")
      if (message) showErrorToast(message)
      throw err
    } finally {
      setRejectingId(null)
    }
  }, [queryClient])

  return { approve, reject, approvingId, rejectingId }
}
