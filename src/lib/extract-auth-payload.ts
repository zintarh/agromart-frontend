import type { AuthResponse } from "@/api/types"

type AuthEnvelope = {
  data?: AuthResponse | { data?: AuthResponse }
}

/** Supports `{ data: { access_token, ... } }` and double-wrapped payloads. */
export function extractAuthPayload(response: unknown): AuthResponse | null {
  if (!response || typeof response !== "object") return null

  const data = (response as AuthEnvelope).data
  if (!data || typeof data !== "object") return null

  if ("access_token" in data && typeof data.access_token === "string") {
    return data as AuthResponse
  }

  const nested = (data as { data?: AuthResponse }).data
  if (nested?.access_token && nested?.refresh_token) {
    return nested
  }

  return null
}
