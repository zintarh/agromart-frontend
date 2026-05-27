import type { ProductRecord } from "@/api/product-types"
import type { ProductImageUpload } from "@/lib/add-product-form"

function isProductRecord(value: unknown): value is ProductRecord {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === "number" &&
    typeof record.name === "string" &&
    typeof record.category_id === "number"
  )
}

/**
 * Normalizes GET /products/:id (and similar) payloads.
 * Supports documented `{ data: ProductRecord, success }` and direct ProductRecord bodies.
 */
export function extractProductRecord(payload: unknown): ProductRecord | null {
  if (isProductRecord(payload)) {
    return payload
  }

  if (!payload || typeof payload !== "object") {
    return null
  }

  const envelope = payload as Record<string, unknown>
  const data = envelope.data

  if (isProductRecord(data)) {
    return data
  }

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>
    if (isProductRecord(nested.data)) {
      return nested.data
    }
    if (isProductRecord(nested.product)) {
      return nested.product
    }
  }

  return null
}

function readPositiveInt(value: unknown): number | undefined {
  const id = typeof value === "number" ? value : Number(value)
  if (!Number.isInteger(id) || id <= 0) return undefined
  return id
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function readFileUrl(files: Record<string, unknown> | undefined): string {
  if (!files) return ""
  return readString(files.file_url) ?? readString(files.fileUrl) ?? ""
}

function readFileName(
  files: Record<string, unknown> | undefined,
  pivot: Record<string, unknown> | undefined
): string {
  return (
    readString(files?.file_name) ??
    readString(files?.fileName) ??
    readString(pivot?.alt_text) ??
    "Product image"
  )
}

function mapImageRow(row: unknown): ProductImageUpload | null {
  if (!row || typeof row !== "object") return null

  const item = row as Record<string, unknown>
  const files =
    item.files && typeof item.files === "object"
      ? (item.files as Record<string, unknown>)
      : undefined

  const pivot =
    item.product_images && typeof item.product_images === "object"
      ? (item.product_images as Record<string, unknown>)
      : undefined

  const fileUrl = readFileUrl(files) || readString(item.file_url) || readString(item.fileUrl) || ""
  const fileId =
    readPositiveInt(files?.id) ??
    readPositiveInt(files?.file_id) ??
    readPositiveInt(pivot?.file_id) ??
    readPositiveInt(item.file_id)

  if (!fileId || !fileUrl) return null

  return {
    fileId,
    previewUrl: fileUrl,
    fileName: readFileName(files, pivot),
  }
}

/** Maps nested `images` from GET /products/:id using `files.file_url` for display. */
export function mapProductImagesFromApi(record: ProductRecord): ProductImageUpload[] {
  const rows = (record as ProductRecord & { images?: unknown }).images
  if (!Array.isArray(rows)) return []

  return rows.map(mapImageRow).filter((image): image is ProductImageUpload => image !== null)
}
