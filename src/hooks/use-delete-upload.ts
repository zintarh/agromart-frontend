"use client"

import { useCallback, useState } from "react"

import { getApiErrorToastMessage } from "@/api/types"
import { showErrorToast } from "@/lib/api-toast"
import { uploadsService } from "@/services/uploads"
import type { LoadingState } from "@/types/loading"

export function useDeleteUpload() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [deletingFileId, setDeletingFileId] = useState<number | null>(null)

  const deleteUpload = useCallback(async (fileId: number) => {
    if (!Number.isFinite(fileId) || fileId <= 0) {
      throw new Error("Invalid file ID.")
    }

    setDeletingFileId(fileId)
    setLoadingState("loading")
    try {
      await uploadsService.remove(fileId)
      setLoadingState("success")
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to delete file")
      if (message) showErrorToast(message)
      setLoadingState("error")
      throw err
    } finally {
      setDeletingFileId(null)
      setLoadingState((state) => (state === "loading" ? "idle" : state))
    }
  }, [])

  return {
    deleteUpload,
    isDeleting: loadingState === "loading",
    deletingFileId,
  }
}
