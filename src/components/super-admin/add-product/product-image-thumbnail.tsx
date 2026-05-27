"use client"

import { useEffect, useState } from "react"
import { ImageIcon, X } from "lucide-react"

import type { ProductImageUpload } from "@/lib/add-product-form"
import {
  fetchProxiedProductImagePreview,
  isAllowedProductImageHost,
} from "@/lib/product-image-remote"
import { resolveProductImagePreview } from "@/lib/product-image-preview"

type ProductImageThumbnailProps = {
  image: ProductImageUpload
  disabled?: boolean
  isRemoving?: boolean
  onRemove: () => void
}

function getDisplaySrc(image: ProductImageUpload): string {
  const session = resolveProductImagePreview(image)
  if (session) return session

  return image.previewUrl?.trim() ?? ""
}

export function ProductImageThumbnail({
  image,
  disabled = false,
  isRemoving = false,
  onRemove,
}: ProductImageThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const [isProxyLoading, setIsProxyLoading] = useState(false)
  const [proxySrc, setProxySrc] = useState("")
  const previewSrc = getDisplaySrc(image)

  useEffect(() => {
    setFailed(false)
    setIsProxyLoading(false)
    setProxySrc("")
  }, [previewSrc, image.fileId])

  const activeSrc = proxySrc || previewSrc
  const showPlaceholder = !activeSrc || failed

  const tryProxy = async () => {
    const remote = image.previewUrl?.trim() ?? ""
    if (!remote || !isAllowedProductImageHost(remote)) return

    setIsProxyLoading(true)
    try {
      const blobUrl = await fetchProxiedProductImagePreview(image.fileId, remote)
      setProxySrc(blobUrl)
      setFailed(false)
    } catch {
      setFailed(true)
    } finally {
      setIsProxyLoading(false)
    }
  }

  return (
    <>
      {showPlaceholder ? (
        <div className="flex size-full flex-col items-center justify-center gap-0.5 bg-muted/60 px-1 text-center">
          {isProxyLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-[#2D5A27] border-t-transparent" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" strokeWidth={1.75} />
          )}
          <span className="line-clamp-2 text-[9px] text-muted-foreground">{image.fileName}</span>
        </div>
      ) : (
        <img
          key={activeSrc}
          src={activeSrc}
          alt={image.fileName}
          className="size-full object-cover"
          onError={() => {
            // If direct `file_url` is private, fall back to authenticated proxy.
            if (!proxySrc) {
              void tryProxy()
              return
            }
            setFailed(true)
          }}
        />
      )}
      <button
        type="button"
        aria-label={`Remove ${image.fileName}`}
        disabled={disabled || isRemoving}
        onClick={onRemove}
        className="absolute top-0.5 right-0.5 z-10 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:cursor-wait disabled:opacity-70"
      >
        {isRemoving ? (
          <span className="size-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <X className="size-3" />
        )}
      </button>
    </>
  )
}
