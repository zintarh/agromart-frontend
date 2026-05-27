import { portalApiClient } from "@/api/portal-api-client"
import type { UploadPurpose, UploadResponse } from "@/api/upload-types"
import type { ApiResponse } from "@/api/types"
import { getPortalAuthorizationHeader } from "@/lib/portal-auth"
import { ApiError } from "@/api/types"

const UPLOADS_BASE = "/uploads"
const MAX_FILE_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
])

export function validateUploadFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "File must be JPEG, PNG, WebP, or PDF."
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File must be 10 MB or smaller."
  }
  return null
}

function assertPortalAuth(): void {
  if (!getPortalAuthorizationHeader()) {
    throw new ApiError(401, "You are not signed in. Please log in again.", {
      message: "Unauthorized",
      success: false,
    })
  }
}

export type UploadProgressHandler = (progress: number) => void

export const uploadsApi = {
  upload(
    file: File,
    purpose: UploadPurpose = "other",
    onProgress?: UploadProgressHandler
  ): Promise<UploadResponse> {
    assertPortalAuth()

    const validationError = validateUploadFile(file)
    if (validationError) {
      return Promise.reject(new ApiError(400, validationError))
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("purpose", purpose)

    return portalApiClient
      .post<UploadResponse>(UPLOADS_BASE, formData, {
        headers: { "Content-Type": undefined },
        timeout: 60000,
        onUploadProgress: (event) => {
          if (!onProgress || !event.total) return
          onProgress(Math.round((event.loaded / event.total) * 100))
        },
      })
      .then((res) => res.data)
  },

  remove(id: number): Promise<ApiResponse> {
    assertPortalAuth()
    return portalApiClient.delete<ApiResponse>(`${UPLOADS_BASE}/${id}`).then((res) => res.data)
  },
}
