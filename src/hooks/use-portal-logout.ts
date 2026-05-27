"use client"

import { useCallback, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { PORTAL_LOGIN_PATH } from "@/lib/portal-route-guard"
import { useAdminStore } from "@/store/adminStore"
import { useSessionStore } from "@/store/sessionStore"

/** Clears portal tokens, session stores, and returns to the shared admin login. */
export function usePortalLogout() {
  const navigate = useNavigate()
  const clearAdminSession = useAdminStore((state) => state.clearSession)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      clearAdminSession()
      useSessionStore.getState().clearSession()
      await navigate({ to: PORTAL_LOGIN_PATH, replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }, [clearAdminSession, navigate])

  return { logout, isLoggingOut }
}
