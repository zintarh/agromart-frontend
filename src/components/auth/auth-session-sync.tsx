"use client"

import { useEffect } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"

import { isClient } from "@/lib/auth-guard"
import { canAccessPortal } from "@/lib/portal-roles"
import { getPortalAccessToken } from "@/lib/portal-auth"
import { useSessionStore } from "@/store/sessionStore"
import { useAdminStore } from "@/store/adminStore"
import { getUser, isAuthenticated } from "@/utils/storage"
import type { AdminUser } from "@/types/admin-user"

const GUEST_PATHS = [
  "/login",
  "/create-account",
  "/forgot-password",
  "/get-started",
  "/accept-invite",
]

/**
 * After SSR hydration, sync persisted tokens into Zustand and enforce client-side
 * redirects when `beforeLoad` was skipped on the server.
 */
export function AuthSessionSync() {
  const navigate = useNavigate()
  const { pathname, search } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      search: state.location.search,
    }),
  })

  useEffect(() => {
    if (!isClient) return

    const user = getUser()
    if (isAuthenticated()) {
      useSessionStore.getState().setSession(user)
    }

    const portalUser = user as AdminUser | null
    if (getPortalAccessToken() && canAccessPortal(portalUser)) {
      useAdminStore.getState().setSession(portalUser)
    }

    const isPortalRoute = pathname.startsWith("/admin")
    const isLegacySuperAdminRoute = pathname.startsWith("/super-admin")
    const isGuestPath = GUEST_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isLegacySuperAdminRoute) {
      const path = pathname.replace(/^\/super-admin/, "/admin") || "/admin/dashboard"
      void navigate({ to: path, search, replace: true })
      return
    }

    // Portal routes: redirects handled by beforeLoad + PortalRouteGate (avoids UI flash).
    if (isPortalRoute) {
      return
    }

    if (isGuestPath && isAuthenticated()) {
      void navigate({ to: "/dashboard", replace: true })
      return
    }

    if (!isGuestPath && !isPortalRoute && !isAuthenticated()) {
      void navigate({ to: "/login", replace: true })
    }
  }, [navigate, pathname, search])

  return null
}
