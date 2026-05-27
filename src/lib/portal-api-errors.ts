import type { AxiosError } from "axios"

import type { ApiErrorResponse } from "@/api/types"
import { ApiError } from "@/api/types"

export const PORTAL_ACTION_DENIED_EVENT = "portal-action-denied"
export const PORTAL_UNAUTHORIZED_EVENT = "portal-unauthorized"

export type PortalActionDeniedDetail = {
  message: string
}

export function getAxiosErrorMessage(error: AxiosError): string {
  const errorResponse = error.response?.data as ApiErrorResponse | undefined
  if (errorResponse?.errors?.length) {
    return errorResponse.errors.map((issue) => issue.message).join(". ")
  }
  return errorResponse?.message || error.message || "An error occurred. Please try again."
}

/**
 * Role / permission failures (403 or explicit role message).
 * Must not clear the session or redirect to login.
 */
export function isPortalRoleAuthorizationError(
  status: number | undefined,
  message: string
): boolean {
  if (status === 403) return true

  const lower = message.toLowerCase()
  return (
    lower.includes("not authorized for this resource") ||
    lower.includes("not authorised for this resource") ||
    (lower.includes("role") && lower.includes("not authorized")) ||
    (lower.includes("role") && lower.includes("not authorised")) ||
    lower.includes("forbidden") ||
    lower.includes("insufficient permissions") ||
    lower.includes("access denied")
  )
}

export function dispatchPortalActionDenied(message: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<PortalActionDeniedDetail>(PORTAL_ACTION_DENIED_EVENT, {
      detail: { message },
    })
  )
}

export function dispatchPortalUnauthorized() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(PORTAL_UNAUTHORIZED_EVENT))
}

export function rejectPortalAxiosError(error: AxiosError): never {
  const status = error.response?.status
  const message = getAxiosErrorMessage(error)
  const errorResponse = error.response?.data as ApiErrorResponse | undefined

  if (isPortalRoleAuthorizationError(status, message)) {
    dispatchPortalActionDenied(message)
    throw new ApiError(status || 403, message, errorResponse, { permissionDenied: true })
  }

  throw new ApiError(status || 500, message, errorResponse)
}
