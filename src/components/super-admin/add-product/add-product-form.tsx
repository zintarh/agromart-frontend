import type React from "react"

import { BasicInformationSection } from "@/components/super-admin/add-product/basic-information-section"
import { PricingInventorySection } from "@/components/super-admin/add-product/pricing-inventory-section"
import { ProductImageSection } from "@/components/super-admin/add-product/product-image-section"
import { PublishingSection } from "@/components/super-admin/add-product/publishing-section"
import type { AddProductFormValues } from "@/lib/add-product-form"

type AddProductFormProps = {
  formValues: AddProductFormValues
  onFormChange: (patch: Partial<AddProductFormValues>) => void
  onPublish?: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  statusDisplay?: React.ReactNode
  submitLabel?: string
  showSaveDraft?: boolean
}

export function AddProductForm({
  formValues,
  onFormChange,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  statusDisplay,
  submitLabel,
  showSaveDraft,
}: AddProductFormProps) {
  return (
    <div className="space-y-4">
      <BasicInformationSection
        values={formValues}
        onChange={onFormChange}
      />
      <PricingInventorySection
        values={formValues}
        onChange={onFormChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <ProductImageSection
          images={formValues.images}
          onChange={(images) => onFormChange({ images })}
          disabled={isSubmitting}
        />
        <PublishingSection
          values={formValues}
          onChange={onFormChange}
          onPublish={onPublish}
          onSaveDraft={onSaveDraft}
          isSubmitting={isSubmitting}
          statusDisplay={statusDisplay}
          submitLabel={submitLabel}
          showSaveDraft={showSaveDraft}
        />
      </div>
    </div>
  )
}
