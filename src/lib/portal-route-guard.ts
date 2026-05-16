import { redirect } from "@tanstack/react-router"

import {
  canAccessAdminOperations,
  canAccessPortal,
  canAccessSuperAdminOperations,
  getPortalHomePath,
  isPortalRole,
  type PortalRole,
} from "@/lib/portal-roles"
import { isClient } from "@/lib/auth-guard"
import { getPortalAccessToken } from "@/lib/portal-auth"
import { syncPortalSessionFromStorage } from "@/lib/portal-session-sync"
import { useAdminStore } from "@/store/adminStore"

export const PORTAL_LOGIN_PATH = "/admin/login"

export function isPortalPublicPath(pathname: string): boolean {
  return pathname === PORTAL_LOGIN_PATH
}

function getPortalUser() {
  if (isClient) {
    syncPortalSessionFromStorage()
  }
  return useAdminStore.getState().user
}

export function isPortalAuthenticated(): boolean {
  return !!getPortalAccessToken() && canAccessPortal(getPortalUser())
}

export function ensurePortalRouteAccess(location: { pathname: string; href: string }) {
  if (!isClient) {
    if (!isPortalPublicPath(location.pathname)) {
      throw redirect({ to: PORTAL_LOGIN_PATH })
    }
    return
  }

  if (isPortalPublicPath(location.pathname)) {
    if (isPortalAuthenticated()) {
      throw redirect({ to: getPortalHomePath(getPortalUser()?.role) })
    }
    return
  }

  if (!getPortalAccessToken()) {
    throw redirect({
      to: PORTAL_LOGIN_PATH,
      search: { redirect: location.pathname },
    })
  }

  const user = getPortalUser()
  if (!canAccessPortal(user)) {
    throw redirect({ to: PORTAL_LOGIN_PATH })
  }
}

export function ensureAdminOperationsAccess() {
  const user = getPortalUser()
  if (!canAccessAdminOperations(user)) {
    throw redirect({ to: getPortalHomePath(user?.role) })
  }
}

export function ensureSuperAdminOperationsAccess() {
  const user = getPortalUser()
  if (!canAccessSuperAdminOperations(user)) {
    throw redirect({ to: getPortalHomePath(user?.role) })
  }
}

/** After login, persist user and verify role is allowed in the portal. */
export function assertPortalLoginRole(role: string | undefined): asserts role is PortalRole {
  if (!isPortalRole(role)) {
    throw new Error("This account does not have access to the admin portal.")
  }
}
