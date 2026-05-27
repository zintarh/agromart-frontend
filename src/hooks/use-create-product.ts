"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateProductRequest } from "@/api/product-types"
import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast, showSuccessToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import { productsService } from "@/services/products"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.create(data),
    onSuccess: (response) => {
      showSuccessToast(response, "Product created successfully")
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
    },
    onError: (err: unknown) => {
      const message = getApiErrorToastMessage(err, "Failed to create product")
      if (message) showErrorToast(message)
    },
  })

  return { createProduct, isCreating }
}
