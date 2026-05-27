"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast, showSuccessToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import { productsService } from "@/services/products"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => productsService.remove(id),
    onSuccess: (response) => {
      showSuccessToast(response, "Product deleted successfully")
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
    },
    onError: (err: unknown) => {
      const message = getApiErrorToastMessage(err, "Failed to delete product")
      if (message) showErrorToast(message)
    },
  })

  return { deleteProduct, isDeleting }
}
