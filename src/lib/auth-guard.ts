/**
 * Auth checks for TanStack Router `beforeLoad`.
 * Skips redirects during SSR — `localStorage` is only available in the browser.
 */

import { isAuthenticated } from "@/utils/storage"
import { isSuperAdminAuthenticated } from "@/utils/super-admin-storage"

export const isClient = typeof window !== "undefined"

/** Redirect unauthenticated users away from protected routes (client only). */
export function shouldRequireAuth(): boolean {
  if (!isClient) return false
  return !isAuthenticated()
}

/** Redirect authenticated users away from guest routes like /login (client only). */
export function shouldRedirectAuthenticatedGuest(): boolean {
  if (!isClient) return false
  return isAuthenticated()
}

export function shouldRequireSuperAdminAuth(): boolean {
  if (!isClient) return false
  return !isSuperAdminAuthenticated()
}

export function shouldRedirectSuperAdminAuthenticatedGuest(): boolean {
  if (!isClient) return false
  return isSuperAdminAuthenticated()
}
