import { ApiError } from "@/api/types"

export function getProductsFetchErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = err.message.trim()
    if (message) return message
    if (err.statusCode >= 500) return "Internal server error"
    return "Failed to load products. Please try again."
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message
  }

  return "Failed to load products. Please try again."
}
