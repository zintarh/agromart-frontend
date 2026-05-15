"use client"

import { useState } from "react"
import { CloudUpload, ImageIcon } from "lucide-react"

import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { UploadImageModal } from "@/components/super-admin/upload-image/upload-image-modal"
import { cn } from "@/lib/utils"

export function ProductImageSection() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [thumbnailPreviews, setThumbnailPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ])

  const handleUploadComplete = (previewUrl: string) => {
    setThumbnailPreviews((current) => {
      const next = [...current]
      const emptyIndex = next.findIndex((item) => item === null)
      if (emptyIndex === -1) return next
      next[emptyIndex] = previewUrl
      return next
    })
  }

  return (
    <>
      <FormSectionCard icon={ImageIcon} title="Product Image" className="h-full">
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-white px-6 py-10 transition-colors hover:bg-muted/30"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#E8F5E9]">
            <CloudUpload className="size-6 text-[#2D5A27]" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-center text-sm font-medium text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            PNG, JPG up to 5MB
          </p>
        </button>

        <div className="mt-4 flex gap-3">
          {thumbnailPreviews.map((preview, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setUploadOpen(true)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40",
                preview && "p-0"
              )}
              aria-label={preview ? "Change product image" : "Add product image"}
            >
              {preview ? (
                <img src={preview} alt="" className="size-full object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      </FormSectionCard>

      <UploadImageModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
      />
    </>
  )
}
