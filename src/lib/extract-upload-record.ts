import type { UploadRecord } from "@/api/upload-types"

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function readPositiveInt(value: unknown): number | undefined {
  const id = typeof value === "number" ? value : Number(value)
  if (!Number.isInteger(id) || id <= 0) return undefined
  return id
}

function normalizeUploadFields(value: Record<string, unknown>): UploadRecord | null {
  const id = readPositiveInt(value.id)
  if (!id) return null

  const file_url = readString(value.file_url) ?? readString(value.fileUrl) ?? ""
  const file_name =
    readString(value.file_name) ?? readString(value.fileName) ?? "Uploaded image"
  const file_key = readString(value.file_key) ?? readString(value.fileKey) ?? ""
  const file_type = readString(value.file_type) ?? readString(value.fileType) ?? "image/jpeg"
  const purpose = (readString(value.purpose) ?? "other") as UploadRecord["purpose"]
  const user_id = readPositiveInt(value.user_id) ?? readPositiveInt(value.userId) ?? 0
  const file_size = readPositiveInt(value.file_size) ?? readPositiveInt(value.fileSize) ?? 0
  const created_at = readString(value.created_at) ?? readString(value.createdAt) ?? ""

  return {
    id,
    user_id,
    file_key,
    file_url,
    file_name,
    file_type,
    file_size,
    purpose,
    created_at,
  }
}

function findUploadRecordDeep(value: unknown, depth = 0): UploadRecord | null {
  if (depth > 5 || value === null || value === undefined) return null

  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    const normalized = normalizeUploadFields(record)
    if (normalized && readPositiveInt(record.id)) {
      return normalized
    }

    for (const nested of Object.values(record)) {
      const found = findUploadRecordDeep(nested, depth + 1)
      if (found) return found
    }
  }

  return null
}

/** Supports direct records and nested API envelopes (`data.data`, etc.). */
export function extractUploadRecord(response: unknown): UploadRecord | null {
  return findUploadRecordDeep(response)
}
