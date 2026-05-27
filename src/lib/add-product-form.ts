import type { CreateProductRequest, ProductRecord, ProductStatus, UpdateProductRequest } from "@/api/product-types"
import { mapProductImagesFromApi } from "@/lib/products-api-response"

export const MAX_PRODUCT_IMAGES = 5

export type ProductImageUpload = {
  fileId: number
  previewUrl: string
  fileName: string
}

export type AddProductFormValues = {
  name: string
  description: string
  sku: string
  categoryId: string
  unit: string
  profitMargin: string
  compareAtPrice: string
  lowStockThreshold: string
  minimumOrderQuantity: string
  isFeatured: boolean
  isOrganic: boolean
  images: ProductImageUpload[]
}

export const defaultAddProductFormValues: AddProductFormValues = {
  name: "",
  description: "",
  sku: "",
  categoryId: "",
  unit: "kg",
  profitMargin: "",
  compareAtPrice: "",
  lowStockThreshold: "10",
  minimumOrderQuantity: "1",
  isFeatured: false,
  isOrganic: false,
  images: [],
}

const UNIT_LABEL_TO_VALUE: Record<string, string> = {
  kg: "kg",
  "per-kg": "kg",
  g: "g",
  piece: "piece",
  bunch: "bunch",
  crate: "crate",
}

export function normalizeProductUnit(unit: string): string {
  return UNIT_LABEL_TO_VALUE[unit] ?? (unit.trim() || "kg")
}

/** Positive integer file IDs only — avoids sending `null` in `file_ids`. */
export function collectValidProductFileIds(images: ProductImageUpload[]): number[] {
  return images
    .map((image) => image.fileId)
    .filter((id): id is number => Number.isInteger(id) && id > 0)
}

export function sanitizeProductImages(images: ProductImageUpload[]): ProductImageUpload[] {
  return images.filter((image) => Number.isInteger(image.fileId) && image.fileId > 0)
}

function parseOptionalInt(value: string, fallback?: number): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return fallback
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseOptionalDecimal(value: string): string | undefined {
  const trimmed = value.trim().replace(/[₦$,\s%]/g, "")
  if (!trimmed) return undefined
  const parsed = Number.parseFloat(trimmed)
  if (!Number.isFinite(parsed)) return undefined
  return parsed.toFixed(2)
}

function normalizeDecimalInput(value: string): string {
  return parseOptionalDecimal(value) ?? ""
}

/** Snapshot of product form state used to build PATCH diffs. */
export type ProductEditSnapshot = {
  name: string
  description: string
  sku: string
  categoryId: string
  unit: string
  profitMargin: string
  compareAtPrice: string
  lowStockThreshold: string
  minimumOrderQuantity: string
  isFeatured: boolean
  isOrganic: boolean
  status: ProductStatus
  fileIds: number[]
}

export function createEditSnapshotFromForm(
  values: AddProductFormValues,
  status: ProductStatus
): ProductEditSnapshot {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    sku: values.sku.trim(),
    categoryId: values.categoryId.trim(),
    unit: normalizeProductUnit(values.unit),
    profitMargin: values.profitMargin.trim(),
    compareAtPrice: values.compareAtPrice.trim(),
    lowStockThreshold: values.lowStockThreshold.trim(),
    minimumOrderQuantity: values.minimumOrderQuantity.trim(),
    isFeatured: values.isFeatured,
    isOrganic: values.isOrganic,
    status,
    fileIds: collectValidProductFileIds(values.images),
  }
}

export function createEditSnapshotFromRecord(record: ProductRecord): ProductEditSnapshot {
  return createEditSnapshotFromForm(mapProductRecordToFormValues(record), record.status)
}

function sameSortedFileIds(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const left = [...a].sort((x, y) => x - y)
  const right = [...b].sort((x, y) => x - y)
  return left.every((id, index) => id === right[index])
}

/**
 * PATCH /products/:id — only sends fields that changed (partial update).
 * Omits empty description to satisfy API min-length when optional.
 */
export function buildPatchProductPayload(
  baseline: ProductEditSnapshot,
  values: AddProductFormValues,
  status: ProductStatus
): UpdateProductRequest {
  const current = createEditSnapshotFromForm(values, status)
  const patch: UpdateProductRequest = {}

  if (!current.name) throw new Error("Product name is required.")

  const categoryId = Number.parseInt(current.categoryId, 10)
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error("Select a category.")
  }

  if (current.name !== baseline.name) patch.name = current.name
  if (categoryId !== Number.parseInt(baseline.categoryId, 10)) patch.category_id = categoryId
  if (current.status !== baseline.status) patch.status = current.status
  if (current.unit !== baseline.unit) patch.unit = current.unit
  if (current.isFeatured !== baseline.isFeatured) patch.is_featured = current.isFeatured
  if (current.isOrganic !== baseline.isOrganic) patch.is_organic = current.isOrganic

  if (current.description !== baseline.description) {
    if (current.description.length >= 10) {
      patch.description = current.description
    } else if (current.description.length > 0) {
      throw new Error("Description must be at least 10 characters when provided.")
    }
  }

  if (current.sku !== baseline.sku && current.sku) patch.sku = current.sku

  const lowStock = parseOptionalInt(current.lowStockThreshold)
  const baselineLowStock = parseOptionalInt(baseline.lowStockThreshold, 10)
  if (lowStock !== undefined && lowStock !== baselineLowStock) {
    patch.low_stock_threshold = lowStock
  }

  const minQty = parseOptionalInt(current.minimumOrderQuantity)
  const baselineMinQty = parseOptionalInt(baseline.minimumOrderQuantity, 1)
  if (minQty !== undefined && minQty !== baselineMinQty) {
    patch.minimum_order_quantity = minQty
  }

  const compareAtPrice = normalizeDecimalInput(current.compareAtPrice)
  const baselineCompareAtPrice = normalizeDecimalInput(baseline.compareAtPrice)
  if (compareAtPrice && compareAtPrice !== baselineCompareAtPrice) {
    patch.compare_at_price = compareAtPrice
  }

  const profitMargin = normalizeDecimalInput(current.profitMargin)
  const baselineProfitMargin = normalizeDecimalInput(baseline.profitMargin)
  if (profitMargin && profitMargin !== baselineProfitMargin) {
    patch.profit_margin = profitMargin
  }

  if (!sameSortedFileIds(current.fileIds, baseline.fileIds)) {
    if (current.fileIds.length > 0) {
      patch.file_ids = current.fileIds
    }
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No changes to save.")
  }

  return patch
}

export function buildCreateProductPayload(
  values: AddProductFormValues,
  status: ProductStatus
): CreateProductRequest {
  const categoryId = Number.parseInt(values.categoryId, 10)
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error("Select a category.")
  }

  const name = values.name.trim()
  if (!name) {
    throw new Error("Product name is required.")
  }

  const description = values.description.trim()
  if (description && description.length < 10) {
    throw new Error("Description must be at least 10 characters when provided.")
  }

  const payload: CreateProductRequest = {
    name,
    category_id: categoryId,
    status,
    unit: normalizeProductUnit(values.unit),
    is_featured: values.isFeatured,
    is_organic: values.isOrganic,
    low_stock_threshold: parseOptionalInt(values.lowStockThreshold, 10),
    minimum_order_quantity: parseOptionalInt(values.minimumOrderQuantity, 1),
  }

  if (description) payload.description = description

  const sku = values.sku.trim()
  if (sku) payload.sku = sku

  const compareAtPrice = parseOptionalDecimal(values.compareAtPrice)
  if (compareAtPrice) payload.compare_at_price = compareAtPrice

  const profitMargin = parseOptionalDecimal(values.profitMargin)
  if (profitMargin) payload.profit_margin = profitMargin

  const fileIds = collectValidProductFileIds(values.images)
  if (values.images.length > 0 && fileIds.length !== values.images.length) {
    throw new Error("One or more images are invalid. Remove them and upload again.")
  }
  if (fileIds.length > 0) {
    payload.file_ids = fileIds
  }

  return payload
}

export function mapProductRecordToFormValues(record: ProductRecord): AddProductFormValues {
  return {
    name: record.name,
    description: record.description ?? "",
    sku: record.sku ?? "",
    categoryId: String(record.category_id),
    unit: record.unit ?? "kg",
    profitMargin: record.profit_margin ?? "",
    compareAtPrice: record.compare_at_price ?? "",
    lowStockThreshold: record.low_stock_threshold != null ? String(record.low_stock_threshold) : "10",
    minimumOrderQuantity: record.minimum_order_quantity != null ? String(record.minimum_order_quantity) : "1",
    isFeatured: Boolean(record.is_featured),
    isOrganic: Boolean(record.is_organic),
    images: mapProductImagesFromApi(record),
  }
}

export function validateAddProductForm(values: AddProductFormValues): string | null {
  try {
    buildCreateProductPayload(values, "pending")
    return null
  } catch (err: unknown) {
    return err instanceof Error ? err.message : "Please check the form and try again."
  }
}

/**
 * Looser payload builder for "Save as Draft".
 * Only name + category are required; optional fields skip strict checks
 * (e.g. description length, image consistency) so partial forms save cleanly.
 */
export function buildDraftProductPayload(values: AddProductFormValues): CreateProductRequest {
  const name = values.name.trim()
  if (!name) throw new Error("Product name is required to save a draft.")

  const categoryId = Number.parseInt(values.categoryId, 10)
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error("Select a category to save a draft.")
  }

  const payload: CreateProductRequest = {
    name,
    category_id: categoryId,
    status: "pending",
    unit: normalizeProductUnit(values.unit),
    is_featured: values.isFeatured,
    is_organic: values.isOrganic,
  }

  const description = values.description.trim()
  if (description) payload.description = description

  const sku = values.sku.trim()
  if (sku) payload.sku = sku

  const lowStock = parseOptionalInt(values.lowStockThreshold)
  if (lowStock !== undefined) payload.low_stock_threshold = lowStock

  const minQty = parseOptionalInt(values.minimumOrderQuantity)
  if (minQty !== undefined) payload.minimum_order_quantity = minQty

  const compareAtPrice = parseOptionalDecimal(values.compareAtPrice)
  if (compareAtPrice) payload.compare_at_price = compareAtPrice

  const profitMargin = parseOptionalDecimal(values.profitMargin)
  if (profitMargin) payload.profit_margin = profitMargin

  const fileIds = collectValidProductFileIds(values.images)
  if (fileIds.length > 0) payload.file_ids = fileIds

  return payload
}
