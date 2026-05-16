"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"

import { useAdminStore } from "@/store/adminStore"
import { clearSuperAdminTokens } from "@/utils/super-admin-storage"
import { SUPER_ADMIN_LOGIN_PATH } from "@/lib/super-admin-route-guard"

/** Redirects to super-admin login when API returns 401 and refresh fails. */
export function SuperAdminAuthListener() {
  const navigate = useNavigate()
  const clearSession = useAdminStore((state) => state.clearSession)

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSuperAdminTokens()
      clearSession()
      navigate({ to: SUPER_ADMIN_LOGIN_PATH })
    }

    window.addEventListener("super-admin-unauthorized", handleUnauthorized)
    return () => window.removeEventListener("super-admin-unauthorized", handleUnauthorized)
  }, [clearSession, navigate])

  return null
}
