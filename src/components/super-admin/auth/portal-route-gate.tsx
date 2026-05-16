"use client"

import { useLayoutEffect, useMemo } from "react"
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router"

import { isClient } from "@/lib/auth-guard"
import { isPortalPublicPath } from "@/lib/portal-route-guard"
import { resolvePortalRouteAccess } from "@/lib/portal-route-access"

/**
 * Blocks guarded portal UI until access is verified (prevents flash before redirect).
 */
export function PortalRouteGate() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const access = useMemo(() => resolvePortalRouteAccess(pathname), [pathname])

  useLayoutEffect(() => {
    const result = resolvePortalRouteAccess(pathname)

    if (result.action === "redirect") {
      void navigate({
        to: result.to,
        search: result.search,
        replace: true,
      })
    }
  }, [pathname, navigate])

  if (!isClient) {
    return isPortalPublicPath(pathname) ? <Outlet /> : null
  }

  if (access.action !== "allow") {
    return null
  }

  return <Outlet />
}
