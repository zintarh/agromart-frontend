import type { ProductImageUpload } from "@/lib/add-product-form"

const sessionPreviews = new Map<number, string>()

export function isPersistablePreviewUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false
  return url.startsWith("https://") || url.startsWith("http://")
}

/** In-memory blob preview for the current browser session (survives modal close). */
export function registerSessionImagePreview(fileId: number, file: File): string {
  revokeSessionImagePreview(fileId)
  const url = URL.createObjectURL(file)
  sessionPreviews.set(fileId, url)
  return url
}

export function revokeSessionImagePreview(fileId: number): void {
  const url = sessionPreviews.get(fileId)
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
  sessionPreviews.delete(fileId)
}

export function clearAllSessionImagePreviews(): void {
  for (const fileId of [...sessionPreviews.keys()]) {
    revokeSessionImagePreview(fileId)
  }
}

/** Prefer in-session blob previews from recent uploads. */
export function resolveProductImagePreview(image: ProductImageUpload): string {
  return sessionPreviews.get(image.fileId) ?? ""
}

/** Only HTTP(S) URLs are saved to localStorage drafts (blob URLs break after refresh). */
export function toPersistedProductImage(image: ProductImageUpload): ProductImageUpload {
  const previewUrl = image.previewUrl?.trim() ?? ""
  return {
    ...image,
    previewUrl: isPersistablePreviewUrl(previewUrl) ? previewUrl : "",
  }
}

export function toPersistedProductImages(images: ProductImageUpload[]): ProductImageUpload[] {
  return images.map(toPersistedProductImage)
}
