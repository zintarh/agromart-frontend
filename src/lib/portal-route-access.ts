import { isClient } from "@/lib/auth-guard"
import {
  canAccessAdminOperations,
  canAccessPortal,
  canAccessSuperAdminOperations,
  canViewPortalUserDetails,
  getPortalHomePath,
} from "@/lib/portal-roles"
import { getPortalAccessToken } from "@/lib/portal-auth"
import { PORTAL_LOGIN_PATH, isPortalPublicPath } from "@/lib/portal-route-guard"
import { syncPortalSessionFromStorage } from "@/lib/portal-session-sync"
import { useAdminStore } from "@/store/adminStore"

export type PortalRouteAccessResult =
  | { action: "allow" }
  | { action: "redirect"; to: string; search?: Record<string, string> }

const ADMIN_OPERATIONS_PREFIXES = [
  "/admin/dashboard",
  "/admin/orders",
  "/admin/products",
  "/admin/categories",
  "/admin/delivery",
  "/admin/payment",
  "/admin/promo-codes",
  "/admin/vendors",
  "/admin/applications",
  "/admin/sub-admins",
  "/admin/reports",
  "/admin/notifications",
  "/admin/settings",
] as const

const SUPER_ADMIN_OPERATIONS_PREFIXES = ["/admin/users"] as const

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function requiresAdminOperations(pathname: string) {
  return matchesPrefix(pathname, ADMIN_OPERATIONS_PREFIXES)
}

function requiresSuperAdminOperations(pathname: string) {
  return matchesPrefix(pathname, SUPER_ADMIN_OPERATIONS_PREFIXES)
}

function isPortalUserDetailPath(pathname: string) {
  return /^\/admin\/users\/[^/]+$/.test(pathname)
}

/** Synchronous portal access check (client). Call after syncPortalSessionFromStorage. */
export function resolvePortalRouteAccess(pathname: string): PortalRouteAccessResult {
  if (!isClient) {
    if (isPortalPublicPath(pathname)) {
      return { action: "allow" }
    }
    return { action: "redirect", to: PORTAL_LOGIN_PATH }
  }

  syncPortalSessionFromStorage()
  const user = useAdminStore.getState().user

  if (isPortalPublicPath(pathname)) {
    if (getPortalAccessToken() && canAccessPortal(user)) {
      return { action: "redirect", to: getPortalHomePath(user?.role) }
    }
    return { action: "allow" }
  }

  if (!getPortalAccessToken()) {
    return {
      action: "redirect",
      to: PORTAL_LOGIN_PATH,
      search: { redirect: pathname },
    }
  }

  if (!canAccessPortal(user)) {
    return { action: "redirect", to: PORTAL_LOGIN_PATH }
  }

  if (requiresAdminOperations(pathname) && !canAccessAdminOperations(user)) {
    return { action: "redirect", to: getPortalHomePath(user?.role) }
  }

  if (requiresSuperAdminOperations(pathname) && !canAccessSuperAdminOperations(user)) {
    return { action: "redirect", to: getPortalHomePath(user?.role) }
  }

  if (isPortalUserDetailPath(pathname) && !canViewPortalUserDetails(user)) {
    return { action: "redirect", to: "/admin/users" }
  }

  return { action: "allow" }
}
