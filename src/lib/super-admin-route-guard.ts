import { redirect } from "@tanstack/react-router"

import {
  shouldRedirectSuperAdminAuthenticatedGuest,
  shouldRequireSuperAdminAuth,
} from "@/lib/auth-guard"

export const SUPER_ADMIN_LOGIN_PATH = "/super-admin/login"

export function isSuperAdminPublicPath(pathname: string): boolean {
  return pathname === SUPER_ADMIN_LOGIN_PATH
}

export function ensureSuperAdminRouteAccess(location: { pathname: string; href: string }) {
  if (isSuperAdminPublicPath(location.pathname)) {
    if (shouldRedirectSuperAdminAuthenticatedGuest()) {
      throw redirect({ to: "/super-admin/dashboard" })
    }
    return
  }

  if (shouldRequireSuperAdminAuth()) {
    throw redirect({
      to: SUPER_ADMIN_LOGIN_PATH,
      search: { redirect: location.pathname },
    })
  }
}
