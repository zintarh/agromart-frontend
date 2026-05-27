"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UpdateProductRequest } from "@/api/product-types"
import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast, showSuccessToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import { productsService } from "@/services/products"

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productsService.update(id, data),
    onSuccess: (response, { id }) => {
      showSuccessToast(response, "Product updated successfully")
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) })
    },
    onError: (err: unknown) => {
      const message = getApiErrorToastMessage(err, "Failed to update product")
      if (message) showErrorToast(message)
    },
  })

  const updateProduct = (id: number, data: UpdateProductRequest) =>
    mutateAsync({ id, data })

  return { updateProduct, isUpdating }
}
