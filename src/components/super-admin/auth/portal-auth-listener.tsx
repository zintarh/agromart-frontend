"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { useAdminStore } from "@/store/adminStore"
import {
  PORTAL_ACTION_DENIED_EVENT,
  PORTAL_UNAUTHORIZED_EVENT,
  type PortalActionDeniedDetail,
} from "@/lib/portal-api-errors"
import { PORTAL_LOGIN_PATH } from "@/lib/portal-route-guard"

/**
 * - Session expired → login
 * - Role / permission denied → toast only (stay logged in)
 */
export function PortalAuthListener() {
  const navigate = useNavigate()
  const clearSession = useAdminStore((state) => state.clearSession)

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession()
      void navigate({ to: PORTAL_LOGIN_PATH })
    }

    const handleActionDenied = (event: Event) => {
      const detail = (event as CustomEvent<PortalActionDeniedDetail>).detail
      toast.error(detail?.message ?? "You do not have permission to perform this action.")
    }

    window.addEventListener(PORTAL_UNAUTHORIZED_EVENT, handleUnauthorized)
    window.addEventListener(PORTAL_ACTION_DENIED_EVENT, handleActionDenied)

    return () => {
      window.removeEventListener(PORTAL_UNAUTHORIZED_EVENT, handleUnauthorized)
      window.removeEventListener(PORTAL_ACTION_DENIED_EVENT, handleActionDenied)
    }
  }, [clearSession, navigate])

  return null
}
