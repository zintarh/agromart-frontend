import { uploadsApi, type UploadProgressHandler } from "@/api/uploads"
import type { UploadPurpose } from "@/api/upload-types"

export const uploadsService = {
  upload(file: File, purpose?: UploadPurpose, onProgress?: UploadProgressHandler) {
    return uploadsApi.upload(file, purpose, onProgress)
  },

  remove(id: number) {
    return uploadsApi.remove(id)
  },
}
