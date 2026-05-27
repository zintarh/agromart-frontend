import { toast } from "sonner"

/** Backend often returns a generic status string instead of a human-readable sentence. */
const GENERIC_API_MESSAGES = new Set([
  "success",
  "successful",
  "ok",
  "done",
  "error",
  "failed",
  "failure",
])

export function isGenericApiMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase()
  return GENERIC_API_MESSAGES.has(normalized)
}

/** Read `message` from standard API envelopes (including nested `data`). */
export function extractApiResponseMessage(payload: unknown): string | undefined {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim()
  }

  if (!payload || typeof payload !== "object") {
    return undefined
  }

  const record = payload as Record<string, unknown>

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message.trim()
  }

  const data = record.data
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>
    if (typeof nested.message === "string" && nested.message.trim()) {
      return nested.message.trim()
    }
  }

  return undefined
}

/** Prefer a specific fallback when the API message is missing or generic (e.g. "success"). */
export function getApiSuccessToastMessage(payload: unknown, fallback: string): string {
  const apiMessage = extractApiResponseMessage(payload)
  if (!apiMessage || isGenericApiMessage(apiMessage)) {
    return fallback
  }
  return apiMessage
}

export function showSuccessToast(payload: unknown, fallback: string): void {
  toast.success(getApiSuccessToastMessage(payload, fallback))
}

export function showErrorToast(message: string): void {
  if (!message.trim()) return
  toast.error(message)
}
