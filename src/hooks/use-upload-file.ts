"use client"

import { useCallback, useState } from "react"

import type { UploadPurpose, UploadRecord } from "@/api/upload-types"
import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast } from "@/lib/api-toast"
import { extractUploadRecord } from "@/lib/extract-upload-record"
import { uploadsService } from "@/services/uploads"
import type { LoadingState } from "@/types/loading"

export function useUploadFile() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(
    async (file: File, purpose: UploadPurpose = "other") => {
      setLoadingState("loading")
      setProgress(0)
      try {
        const response = await uploadsService.upload(file, purpose, setProgress)
        const record = extractUploadRecord(response)
        if (!record?.id) {
          throw new Error("Upload succeeded but the server returned an invalid file id.")
        }
        setLoadingState("success")
        setProgress(100)
        return record
      } catch (err: unknown) {
        const message = getApiErrorToastMessage(err, "Failed to upload file")
        if (message) showErrorToast(message)
        setLoadingState("error")
        setProgress(0)
        throw err
      } finally {
        setLoadingState((state) => (state === "loading" ? "idle" : state))
      }
    },
    []
  )

  return {
    uploadFile,
    uploadProgress: progress,
    isUploading: loadingState === "loading",
  }
}
