"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import type { ProductStatus } from "@/api/product-types"
import { AddProductForm } from "@/components/super-admin/add-product/add-product-form"
import { AddProductHeaderActions } from "@/components/super-admin/add-product/add-product-header-actions"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ProductStatusBadge } from "@/components/super-admin/shared/product-status-badge"
import { useUpdateProduct } from "@/hooks/use-update-product"
import {
  buildPatchProductPayload,
  createEditSnapshotFromRecord,
  defaultAddProductFormValues,
  mapProductRecordToFormValues,
  type AddProductFormValues,
  type ProductEditSnapshot,
} from "@/lib/add-product-form"
import { showErrorToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import { productsService } from "@/services/products"

type EditProductPageProps = {
  productId: number
}

export function EditProductPage({ productId }: EditProductPageProps) {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<AddProductFormValues>(defaultAddProductFormValues)
  const [baseline, setBaseline] = useState<ProductEditSnapshot | null>(null)
  const [status, setStatus] = useState<ProductStatus>("pending")

  const { updateProduct, isUpdating } = useUpdateProduct()

  const isValidId = Number.isFinite(productId) && productId > 0

  const { data: productRecord, isLoading: isFetching, isError } = useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsService.getById(productId),
    enabled: isValidId,
    retry: (failureCount, error) => {
      if ((error as { statusCode?: number })?.statusCode === 404) return false
      return failureCount < 1
    },
  })

  useEffect(() => {
    if (!isValidId) {
      showErrorToast("Invalid product ID.")
    }
  }, [isValidId])

  useEffect(() => {
    if (productRecord) {
      setFormValues(mapProductRecordToFormValues(productRecord))
      setBaseline(createEditSnapshotFromRecord(productRecord))
      setStatus(productRecord.status)
    }
  }, [productRecord])

  const updateForm = (patch: Partial<AddProductFormValues>) =>
    setFormValues((prev) => ({ ...prev, ...patch }))

  const handleUpdate = async () => {
    if (!baseline) return

    let payload
    try {
      payload = buildPatchProductPayload(baseline, formValues, status)
    } catch (err: unknown) {
      showErrorToast(err instanceof Error ? err.message : "Please check the form.")
      return
    }
    try {
      await updateProduct(productId, payload)
      void navigate({ to: "/admin/products" })
    } catch {
      // useUpdateProduct already shows the API error toast
    }
  }

  const loadFailed = !isValidId || isError

  return (
    <SuperAdminLayout
      title="Update Product"
      subtitle="Edit product details and settings"
      headerActions={
        <AddProductHeaderActions
          onPublish={() => void handleUpdate()}
          submitLabel="Update Product"
          isSubmitting={isUpdating}
        />
      }
      showNotifications={false}
    >
      {isFetching ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : loadFailed ? (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white px-6 py-10 text-center text-sm text-muted-foreground">
          Unable to load this product.{" "}
          <button
            type="button"
            className="font-medium text-[#2D5A27] underline-offset-2 hover:underline"
            onClick={() => void navigate({ to: "/admin/products" })}
          >
            Back to catalog
          </button>
        </div>
      ) : (
        <AddProductForm
          formValues={formValues}
          onFormChange={updateForm}
          onPublish={() => void handleUpdate()}
          isSubmitting={isUpdating}
          statusDisplay={<ProductStatusBadge status={status} />}
          submitLabel="Update Product"
          showSaveDraft={false}
        />
      )}
    </SuperAdminLayout>
  )
}
