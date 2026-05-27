import {
  defaultAddProductFormValues,
  sanitizeProductImages,
  type AddProductFormValues,
  type ProductImageUpload,
} from "@/lib/add-product-form"
import { isPersistablePreviewUrl } from "@/lib/product-image-preview"

const STORAGE_KEY = "agromart_add_product_draft"
const DRAFT_VERSION = 1

type StoredAddProductDraft = {
  version: number
  values: AddProductFormValues
  updatedAt: number
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function sanitizeImages(images: unknown) {
  if (!Array.isArray(images)) return []

  const parsed = images
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const record = item as Record<string, unknown>
      const fileId = Number(record.fileId)
      if (!Number.isInteger(fileId) || fileId <= 0) return null

      const fileName =
        typeof record.fileName === "string" ? record.fileName : "Uploaded image"
      const rawPreview =
        typeof record.previewUrl === "string" ? record.previewUrl.trim() : ""
      const previewUrl = isPersistablePreviewUrl(rawPreview) ? rawPreview : ""

      return { fileId, fileName, previewUrl } satisfies ProductImageUpload
    })
    .filter((image): image is NonNullable<typeof image> => image !== null)

  return sanitizeProductImages(parsed)
}

export function mergeAddProductFormValues(
  partial: Partial<AddProductFormValues> | null | undefined
): AddProductFormValues {
  if (!partial) return defaultAddProductFormValues

  return {
    ...defaultAddProductFormValues,
    ...partial,
    images: sanitizeImages(partial.images),
  }
}

export function hasAddProductDraftContent(values: AddProductFormValues): boolean {
  return (
    values.name.trim() !== "" ||
    values.description.trim() !== "" ||
    values.sku.trim() !== "" ||
    values.categoryId.trim() !== "" ||
    values.profitMargin.trim() !== "" ||
    values.compareAtPrice.trim() !== "" ||
    values.isFeatured ||
    values.isOrganic ||
    values.images.length > 0 ||
    values.unit !== defaultAddProductFormValues.unit ||
    values.lowStockThreshold !== defaultAddProductFormValues.lowStockThreshold ||
    values.minimumOrderQuantity !== defaultAddProductFormValues.minimumOrderQuantity
  )
}

export function loadAddProductDraft(): AddProductFormValues | null {
  if (!isBrowser()) return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredAddProductDraft
    if (parsed?.version !== DRAFT_VERSION || !parsed.values) return null

    const values = mergeAddProductFormValues(parsed.values)
    return hasAddProductDraftContent(values) ? values : null
  } catch {
    return null
  }
}

export function saveAddProductDraft(values: AddProductFormValues): void {
  if (!isBrowser()) return

  if (!hasAddProductDraftContent(values)) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  const payload: StoredAddProductDraft = {
    version: DRAFT_VERSION,
    values: {
      ...values,
      images: values.images.map((image) => ({
        ...image,
        previewUrl: isPersistablePreviewUrl(image.previewUrl) ? image.previewUrl : "",
      })),
    },
    updatedAt: Date.now(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearAddProductDraft(): void {
  if (!isBrowser()) return
  localStorage.removeItem(STORAGE_KEY)
}
