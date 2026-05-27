import { getPortalAuthHeaders } from "@/lib/portal-auth"

const ALLOWED_IMAGE_HOSTS = new Set([
  "pub-placeholder.r2.dev",
  "r2.dev",
  "cloudflarestorage.com",
])

const proxiedBlobUrls = new Map<number, string>()

export function isAllowedProductImageHost(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url)
    if (protocol !== "https:" && protocol !== "http:") return false
    return ALLOWED_IMAGE_HOSTS.has(hostname) || hostname.endsWith(".r2.dev")
  } catch {
    return false
  }
}

export function getProxiedProductImageUrl(fileId: number, remoteUrl: string): string {
  const params = new URLSearchParams({ url: remoteUrl })
  return `/api/files/${fileId}/preview?${params.toString()}`
}

export async function fetchProxiedProductImagePreview(
  fileId: number,
  remoteUrl: string
): Promise<string> {
  const cached = proxiedBlobUrls.get(fileId)
  if (cached) return cached

  const response = await fetch(getProxiedProductImageUrl(fileId, remoteUrl), {
    headers: getPortalAuthHeaders({ Accept: "image/*,*/*" }),
  })

  if (!response.ok) {
    throw new Error(`Image preview failed (${response.status})`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  proxiedBlobUrls.set(fileId, objectUrl)
  return objectUrl
}

export function revokeProxiedProductImagePreview(fileId: number): void {
  const objectUrl = proxiedBlobUrls.get(fileId)
  if (objectUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(objectUrl)
  }
  proxiedBlobUrls.delete(fileId)
}
