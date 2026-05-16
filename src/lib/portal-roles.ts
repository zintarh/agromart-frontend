import type { AdminPortalRole, AdminUser } from "@/types/admin-user"

export const PORTAL_ROLES = ["admin", "super_admin"] as const

export type PortalRole = (typeof PORTAL_ROLES)[number]

export function isPortalRole(role: string | undefined | null): role is PortalRole {
  return role === "admin" || role === "super_admin"
}

export function isSuperAdminRole(role: string | undefined | null): boolean {
  return role === "super_admin"
}

export function isAdminRole(role: string | undefined | null): boolean {
  return role === "admin"
}

/** May access the admin portal shell (login required). */
export function canAccessPortal(user: AdminUser | null | undefined): boolean {
  return isPortalRole(user?.role)
}

/** Catalog, orders, products, categories, commerce, etc. */
export function canAccessAdminOperations(user: AdminUser | null | undefined): boolean {
  return isAdminRole(user?.role)
}

/** User directory, invite (admin/aggregator), promote, deactivate. */
export function canAccessSuperAdminOperations(user: AdminUser | null | undefined): boolean {
  return isSuperAdminRole(user?.role)
}

/** Super admins cannot open per-user profile detail (GET /user/profile is user-role only). */
export function canViewPortalUserDetails(user: AdminUser | null | undefined): boolean {
  return canAccessPortal(user) && !isSuperAdminRole(user?.role)
}

export function getPortalHomePath(role: string | undefined | null): string {
  if (isSuperAdminRole(role)) return "/admin/users"
  if (isAdminRole(role)) return "/admin/dashboard"
  return "/admin/login"
}
