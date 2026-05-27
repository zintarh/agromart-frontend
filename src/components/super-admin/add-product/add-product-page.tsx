"use client"

import { useState } from "react"

import { AddProductForm } from "@/components/super-admin/add-product/add-product-form"
import { AddProductHeaderActions } from "@/components/super-admin/add-product/add-product-header-actions"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ProductDraftSavedModal } from "@/components/super-admin/product-draft/product-draft-saved-modal"
import {
  ProductPublishedModal,
  type PublishedProductSnapshot,
} from "@/components/super-admin/product-published/product-published-modal"
import { useAddProductCategories } from "@/hooks/use-add-product-categories"
import { useAddProductFormDraft } from "@/hooks/use-add-product-form-draft"
import { useCreateProduct } from "@/hooks/use-create-product"
import { saveAddProductDraft } from "@/lib/add-product-draft-storage"
import {
  buildDraftProductSnapshot,
  type DraftProductSnapshot,
} from "@/lib/add-product-draft-snapshot"
import { buildCreateProductPayload, buildDraftProductPayload } from "@/lib/add-product-form"
import { showErrorToast } from "@/lib/api-toast"

export function AddProductPage() {
  const [publishedOpen, setPublishedOpen] = useState(false)
  const [draftSavedOpen, setDraftSavedOpen] = useState(false)
  const [draftProduct, setDraftProduct] = useState<DraftProductSnapshot | null>(null)
  const [publishedProduct, setPublishedProduct] = useState<PublishedProductSnapshot | null>(null)

  const { formValues, updateForm, resetForm } = useAddProductFormDraft()
  const { createProduct, isCreating } = useCreateProduct()
  const { categoryOptions } = useAddProductCategories()

  const handlePublish = async () => {
    let payload
    try {
      payload = buildCreateProductPayload(formValues, "active")
    } catch (err: unknown) {
      showErrorToast(err instanceof Error ? err.message : "Please check the form.")
      return
    }
    try {
      await createProduct(payload)
      const categoryName =
        categoryOptions.find((opt) => opt.value === formValues.categoryId)?.label ?? ""
      setPublishedProduct({
        name: formValues.name,
        categoryName,
        unit: formValues.unit,
        compareAtPrice: formValues.compareAtPrice || undefined,
        imageUrl: formValues.images[0]?.previewUrl,
      })
      resetForm()
      setPublishedOpen(true)
    } catch {
      // useCreateProduct already shows the API error toast
    }
  }

  const handleSaveDraft = async () => {
    let payload
    try {
      payload = buildDraftProductPayload(formValues)
    } catch (err: unknown) {
      showErrorToast(err instanceof Error ? err.message : "Please check the form.")
      return
    }

    try {
      await createProduct(payload)
      saveAddProductDraft(formValues)
      setDraftProduct(buildDraftProductSnapshot(formValues, categoryOptions))
      setDraftSavedOpen(true)
    } catch {
      // useCreateProduct already shows the API error toast
    }
  }

  return (
    <SuperAdminLayout
      title="Add Product"
      subtitle="Add new products to the catalog"
      headerActions={
        <AddProductHeaderActions onPublish={() => void handlePublish()} />
      }
      showNotifications={false}
    >
      <AddProductForm
        formValues={formValues}
        onFormChange={updateForm}
        onPublish={() => void handlePublish()}
        onSaveDraft={() => void handleSaveDraft()}
        isSubmitting={isCreating}
      />
      <ProductPublishedModal open={publishedOpen} onOpenChange={setPublishedOpen} product={publishedProduct} />
      <ProductDraftSavedModal
        open={draftSavedOpen}
        onOpenChange={setDraftSavedOpen}
        product={draftProduct}
      />
    </SuperAdminLayout>
  )
}
