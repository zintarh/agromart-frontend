"use client"

import { useEffect } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"

import { isClient } from "@/lib/auth-guard"
import { useSessionStore } from "@/store/sessionStore"
import { useSuperAdminSessionStore } from "@/store/superAdminSessionStore"
import { getUser, isAuthenticated } from "@/utils/storage"
import type { User } from "@/api/types"
import { getSuperAdminUser, isSuperAdminAuthenticated } from "@/utils/super-admin-storage"

const GUEST_PATHS = ["/login", "/create-account", "/forgot-password", "/get-started"]
const SUPER_ADMIN_LOGIN = "/super-admin/login"

/**
 * After SSR hydration, sync persisted tokens into Zustand and enforce client-side
 * redirects when `beforeLoad` was skipped on the server.
 */
export function AuthSessionSync() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    if (!isClient) return

    const user = getUser()
    if (isAuthenticated()) {
      useSessionStore.getState().setSession(user)
    }

    const superAdminUser = getSuperAdminUser<User>()
    if (isSuperAdminAuthenticated()) {
      useSuperAdminSessionStore.getState().setSession(superAdminUser)
    }

    const isSuperAdminRoute = pathname.startsWith("/super-admin")
    const isGuestPath = GUEST_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isSuperAdminRoute) {
      if (pathname === SUPER_ADMIN_LOGIN && isSuperAdminAuthenticated()) {
        void navigate({ to: "/super-admin/dashboard", replace: true })
        return
      }
      if (pathname !== SUPER_ADMIN_LOGIN && !isSuperAdminAuthenticated()) {
        void navigate({
          to: SUPER_ADMIN_LOGIN,
          search: { redirect: pathname },
          replace: true,
        })
      }
      return
    }

    if (isGuestPath && isAuthenticated()) {
      void navigate({ to: "/dashboard", replace: true })
      return
    }

    if (!isGuestPath && !isSuperAdminRoute && !isAuthenticated()) {
      void navigate({ to: "/login", replace: true })
    }
  }, [navigate, pathname])

  return null
}
