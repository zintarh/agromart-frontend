"use client"

import { useState } from "react"
import { CloudUpload, ImageIcon } from "lucide-react"

import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { ProductImageThumbnail } from "@/components/super-admin/add-product/product-image-thumbnail"
import { UploadImageModal } from "@/components/super-admin/upload-image/upload-image-modal"
import { useDeleteUpload } from "@/hooks/use-delete-upload"
import { MAX_PRODUCT_IMAGES, type ProductImageUpload } from "@/lib/add-product-form"
import { revokeProxiedProductImagePreview } from "@/lib/product-image-remote"
import { revokeSessionImagePreview } from "@/lib/product-image-preview"
import { cn } from "@/lib/utils"

type ProductImageSectionProps = {
  images: ProductImageUpload[]
  onChange: (images: ProductImageUpload[]) => void
  disabled?: boolean
}

export function ProductImageSection({ images, onChange, disabled = false }: ProductImageSectionProps) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const { deleteUpload, isDeleting, deletingFileId } = useDeleteUpload()

  const canAddMore = images.length < MAX_PRODUCT_IMAGES

  const handleUploadsComplete = (newUploads: ProductImageUpload[]) => {
    const slots = MAX_PRODUCT_IMAGES - images.length
    onChange([...images, ...newUploads.slice(0, slots)])
  }

  const handleRemove = async (fileId: number) => {
    if (disabled || isDeleting) return

    try {
      await deleteUpload(fileId)
      revokeSessionImagePreview(fileId)
      revokeProxiedProductImagePreview(fileId)
      onChange(images.filter((img) => img.fileId !== fileId))
    } catch {
      // Toast shown by hook
    }
  }

  const emptySlots = Array.from(
    { length: Math.max(0, 3 - images.length) },
    (_, i) => i
  )

  return (
    <>
      <FormSectionCard icon={ImageIcon} title="Product Images" className="h-full">
        <button
          type="button"
          disabled={disabled || !canAddMore || isDeleting}
          onClick={() => setUploadOpen(true)}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-white px-6 py-10 transition-colors",
            canAddMore && !disabled && !isDeleting
              ? "hover:bg-muted/30 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#E8F5E9]">
            <CloudUpload className="size-6 text-[#2D5A27]" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-center text-sm font-medium text-foreground">
            {canAddMore ? "Click to upload or drag and drop" : "Maximum images reached"}
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            PNG, JPG, WebP up to 10 MB · {images.length}/{MAX_PRODUCT_IMAGES} added
          </p>
        </button>

        {(images.length > 0 || emptySlots.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((image) => (
              <div
                key={image.fileId}
                className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40"
              >
                <ProductImageThumbnail
                  image={image}
                  disabled={disabled || isDeleting}
                  isRemoving={deletingFileId === image.fileId}
                  onRemove={() => void handleRemove(image.fileId)}
                />
              </div>
            ))}
            {emptySlots.map((i) => (
              <button
                key={i}
                type="button"
                disabled={disabled || !canAddMore || isDeleting}
                onClick={() => setUploadOpen(true)}
                className="size-16 shrink-0 rounded-lg border border-dashed border-border bg-muted/20 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Add product image"
              />
            ))}
          </div>
        )}
      </FormSectionCard>

      <UploadImageModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        currentImageCount={images.length}
        onUploadsComplete={handleUploadsComplete}
      />
    </>
  )
}
