"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { UploadImageDropzone } from "@/components/super-admin/upload-image/upload-image-dropzone"
import { UploadProgressItem } from "@/components/super-admin/upload-image/upload-progress-item"
import { Button } from "@/components/ui/button"

type UploadFile = {
  id: string
  fileName: string
  uploadedSize: string
  totalSize: string
  progress: number
  previewUrl?: string
  totalBytes?: number
}

type UploadImageModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (previewUrl: string) => void
}

const LETTUCE_PREVIEW =
  "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&h=80&fit=crop"

const MOCK_UPLOAD: UploadFile = {
  id: "mock",
  fileName: "organic-lettuce-fresh.jpg",
  uploadedSize: "1.2 MB",
  totalSize: "2.4 MB",
  progress: 64,
  previewUrl: LETTUCE_PREVIEW,
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadImageModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadImageModalProps) {
  const [uploads, setUploads] = useState<UploadFile[]>([])

  useLayoutEffect(() => {
    if (!open) {
      setUploads([])
      return
    }
    setUploads([MOCK_UPLOAD])
  }, [open])

  useEffect(() => {
    const active = uploads.find((u) => u.id !== "mock" && u.progress < 100)
    if (!active) return

    const interval = window.setInterval(() => {
      setUploads((current) =>
        current.map((item) => {
          if (item.id === "mock" || item.progress >= 100) return item
          const nextProgress = Math.min(item.progress + 4, 100)
          const totalBytes = item.totalBytes ?? 0
          return {
            ...item,
            progress: nextProgress,
            uploadedSize: formatFileSize((totalBytes * nextProgress) / 100),
          }
        })
      )
    }, 400)

    return () => window.clearInterval(interval)
  }, [uploads])

  const handleFilesSelected = useCallback((files: FileList) => {
    const file = files[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setUploads([
      {
        id: crypto.randomUUID(),
        fileName: file.name,
        uploadedSize: "0 KB",
        totalSize: formatFileSize(file.size),
        progress: 0,
        previewUrl,
        totalBytes: file.size,
      },
    ])
  }, [])

  const handleCancelUpload = useCallback((id: string) => {
    setUploads((current) => {
      const item = current.find((upload) => upload.id === id)
      if (item?.previewUrl && item.id !== "mock") {
        URL.revokeObjectURL(item.previewUrl)
      }
      return current.filter((upload) => upload.id !== id)
    })
  }, [])

  const handleUpload = useCallback(() => {
    const completed = uploads[0]
    if (completed?.previewUrl) {
      onUploadComplete?.(completed.previewUrl)
    }
    onOpenChange(false)
  }, [onOpenChange, onUploadComplete, uploads])

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
        className="h-9 rounded-lg bg-[#2D5A27] px-4 text-sm font-medium text-white hover:bg-[#2D5A27]/90"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </>
  )

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Image"
      footer={footer}
    >
      <UploadImageDropzone onFilesSelected={handleFilesSelected} />

      {uploads.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Uploading
          </p>
          <div className="space-y-4">
            {uploads.map((upload) => (
              <UploadProgressItem
                key={upload.id}
                fileName={upload.fileName}
                uploadedSize={upload.uploadedSize}
                totalSize={upload.totalSize}
                progress={upload.progress}
                previewUrl={upload.previewUrl}
                onCancel={() => handleCancelUpload(upload.id)}
              />
            ))}
          </div>
        </div>
      )}
    </AdminModal>
  )
}
