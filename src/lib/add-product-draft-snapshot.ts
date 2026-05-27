import type { AddProductFormValues } from "@/lib/add-product-form"
import { isPersistablePreviewUrl, resolveProductImagePreview } from "@/lib/product-image-preview"

export type DraftProductSnapshot = {
  name: string
  categoryName: string
  unit: string
  compareAtPrice?: string
  imageUrl?: string
}

type CategoryOption = { value: string; label: string }

export function buildDraftProductSnapshot(
  formValues: AddProductFormValues,
  categoryOptions: CategoryOption[]
): DraftProductSnapshot {
  const categoryName =
    categoryOptions.find((opt) => opt.value === formValues.categoryId)?.label ?? ""

  const firstImage = formValues.images[0]
  let imageUrl: string | undefined
  if (firstImage) {
    const sessionPreview = resolveProductImagePreview(firstImage)
    if (sessionPreview) {
      imageUrl = sessionPreview
    } else if (isPersistablePreviewUrl(firstImage.previewUrl)) {
      imageUrl = firstImage.previewUrl
    }
  }

  return {
    name: formValues.name.trim() || "Untitled draft",
    categoryName: categoryName || "Uncategorized",
    unit: formValues.unit,
    compareAtPrice: formValues.compareAtPrice || undefined,
    imageUrl,
  }
}
