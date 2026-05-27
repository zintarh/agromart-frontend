import { isClient } from "@/lib/auth-guard"
import { bootstrapPortalAuth } from "@/lib/portal-auth-bootstrap"
import { canAccessPortal } from "@/lib/portal-roles"
import { getPortalAccessToken } from "@/lib/portal-auth"
import type { AdminUser } from "@/types/admin-user"
import { getUser } from "@/utils/storage"
import { getSuperAdminUser } from "@/utils/super-admin-storage"

export type PortalAuthSnapshot = {
  token: string | null
  user: AdminUser | null
  /** Token present and user has a portal role (admin / super_admin). */
  isAuthenticated: boolean
}

/** Reads user from either storage key (main login vs legacy super-admin). */
export function getStoredPortalUser(): AdminUser | null {
  return (getUser() as AdminUser | null) ?? getSuperAdminUser<AdminUser>()
}

/** Single synchronous read from localStorage — use for route guards, not Zustand. */
export function readPortalAuthSnapshot(): PortalAuthSnapshot {
  if (isClient) {
    bootstrapPortalAuth()
  }

  const token = getPortalAccessToken()
  const user = getStoredPortalUser()
  const isAuthenticated = Boolean(token && canAccessPortal(user))

  return {
    token,
    user: isAuthenticated ? user : null,
    isAuthenticated,
  }
}
