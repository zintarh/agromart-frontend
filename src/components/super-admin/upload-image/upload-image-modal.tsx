"use client"

import { useCallback, useLayoutEffect, useState } from "react"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { UploadImageDropzone } from "@/components/super-admin/upload-image/upload-image-dropzone"
import { UploadProgressItem } from "@/components/super-admin/upload-image/upload-progress-item"
import { Button } from "@/components/ui/button"
import type { ProductImageUpload } from "@/lib/add-product-form"
import { MAX_PRODUCT_IMAGES } from "@/lib/add-product-form"
import { useDeleteUpload } from "@/hooks/use-delete-upload"
import { extractUploadRecord } from "@/lib/extract-upload-record"
import { registerSessionImagePreview, revokeSessionImagePreview } from "@/lib/product-image-preview"
import { uploadsService } from "@/services/uploads"

type FileUploadState = {
  localId: string
  file: File
  fileName: string
  progress: number
  status: "uploading" | "done" | "error"
  fileId?: number
  previewUrl?: string
  errorMessage?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type UploadImageModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentImageCount?: number
  onUploadsComplete?: (uploads: ProductImageUpload[]) => void
}

export function UploadImageModal({
  open,
  onOpenChange,
  currentImageCount = 0,
  onUploadsComplete,
}: UploadImageModalProps) {
  const [uploads, setUploads] = useState<FileUploadState[]>([])
  const [cancellingLocalId, setCancellingLocalId] = useState<string | null>(null)
  const { deleteUpload } = useDeleteUpload()

  useLayoutEffect(() => {
    if (!open) setUploads([])
  }, [open])

  const startUpload = useCallback(
    async (entry: FileUploadState) => {
      try {
        const response = await uploadsService.upload(
          entry.file,
          "other",
          (progress) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.localId === entry.localId ? { ...u, progress } : u
              )
            )
          }
        )
        const record = extractUploadRecord(response)
        if (!record?.id) throw new Error("Server returned an invalid file ID.")

        const previewUrl = registerSessionImagePreview(record.id, entry.file)
        setUploads((prev) =>
          prev.map((u) =>
            u.localId === entry.localId
              ? { ...u, status: "done", progress: 100, fileId: record.id, previewUrl }
              : u
          )
        )
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed."
        setUploads((prev) =>
          prev.map((u) =>
            u.localId === entry.localId
              ? { ...u, status: "error", progress: 0, errorMessage }
              : u
          )
        )
      }
    },
    []
  )

  const handleFilesSelected = useCallback(
    (files: FileList) => {
      const remaining = MAX_PRODUCT_IMAGES - currentImageCount - uploads.length
      const accepted = Array.from(files).slice(0, Math.max(0, remaining))
      if (accepted.length === 0) return

      const newEntries: FileUploadState[] = accepted.map((file) => ({
        localId: crypto.randomUUID(),
        file,
        fileName: file.name,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploads((prev) => [...prev, ...newEntries])
      newEntries.forEach((entry) => void startUpload(entry))
    },
    [currentImageCount, uploads.length, startUpload]
  )

  const handleCancel = useCallback(
    async (localId: string) => {
      const entry = uploads.find((u) => u.localId === localId)
      if (!entry) return

      if (entry.status === "uploading") {
        setUploads((prev) => prev.filter((u) => u.localId !== localId))
        return
      }

      if (entry.fileId) {
        setCancellingLocalId(localId)
        try {
          await deleteUpload(entry.fileId)
          revokeSessionImagePreview(entry.fileId)
        } catch {
          return
        } finally {
          setCancellingLocalId(null)
        }
      }

      setUploads((prev) => prev.filter((u) => u.localId !== localId))
    },
    [uploads, deleteUpload]
  )

  const handleConfirm = useCallback(() => {
    const completed = uploads
      .filter((u) => u.status === "done" && u.fileId)
      .map((u) => ({
        fileId: u.fileId!,
        previewUrl: u.previewUrl ?? "",
        fileName: u.fileName,
      }))

    if (completed.length > 0) onUploadsComplete?.(completed)
    onOpenChange(false)
  }, [uploads, onUploadsComplete, onOpenChange])

  const allDone = uploads.length > 0 && uploads.every((u) => u.status !== "uploading")
  const completedCount = uploads.filter((u) => u.status === "done").length
  const slotsLeft = MAX_PRODUCT_IMAGES - currentImageCount - uploads.length

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 border-border bg-white px-4 text-sm font-medium text-muted-foreground"
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={completedCount === 0}
        className="h-9 rounded-lg bg-[#2D5A27] px-4 text-sm font-medium text-white hover:bg-[#2D5A27]/90 disabled:opacity-50"
        onClick={handleConfirm}
      >
        {allDone
          ? `Add ${completedCount} image${completedCount !== 1 ? "s" : ""}`
          : "Uploading…"}
      </Button>
    </>
  )

  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title="Upload Images" footer={footer}>
      <UploadImageDropzone
        onFilesSelected={handleFilesSelected}
        disabled={slotsLeft <= 0}
        hint={
          slotsLeft > 0
            ? `You can add up to ${slotsLeft} more image${slotsLeft !== 1 ? "s" : ""}`
            : `Maximum of ${MAX_PRODUCT_IMAGES} images reached`
        }
      />

      {uploads.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Uploading ({completedCount}/{uploads.length})
          </p>
          <div className="space-y-4">
            {uploads.map((upload) => (
              <UploadProgressItem
                key={upload.localId}
                fileName={upload.fileName}
                uploadedSize={formatBytes((upload.file.size * upload.progress) / 100)}
                totalSize={formatBytes(upload.file.size)}
                progress={upload.progress}
                status={upload.status}
                errorMessage={upload.errorMessage}
                previewUrl={upload.previewUrl}
                onCancel={() => void handleCancel(upload.localId)}
                isCancelling={cancellingLocalId === upload.localId}
              />
            ))}
          </div>
        </div>
      )}
    </AdminModal>
  )
}
