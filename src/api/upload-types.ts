import type { ApiResponse } from "@/api/types"

export type UploadPurpose =
  | "profile_picture"
  | "cac_document"
  | "drivers_license"
  | "other"

export type UploadRecord = {
  id: number
  user_id: number
  file_key: string
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  purpose: UploadPurpose
  created_at: string
}

export type UploadResponse = ApiResponse<UploadRecord>
