"use client"

import { useState } from "react"
import { toast } from "sonner"

import { authService } from "@/services/auth"
import { useAdminStore } from "@/store/adminStore"
import { useSessionStore } from "@/store/sessionStore"
import type { AdminUser } from "@/types/admin-user"
import type { LoadingState } from "@/types/loading"
import { isPortalRole } from "@/lib/portal-roles"

export type CompleteInvitePayload = {
  token: string
  first_name: string
  last_name: string
  password: string
  phone?: string
  country_code?: string
}

export function useCompleteInvite() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const completeInvite = async (data: CompleteInvitePayload) => {
    setLoadingState("loading")
    setError(null)

    try {
      const response = await authService.completeInvite(data)
      const user = authService.getCurrentUser()

      if (user) {
        useSessionStore.getState().setSession(user)
        if (isPortalRole(user.role)) {
          useAdminStore.getState().setSession(user as AdminUser)
        }
      }

      toast.success(response.message ?? "Registration completed successfully")
      setLoadingState("success")
      return { response, user }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to complete registration. Please try again."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  return {
    completeInvite,
    loadingState,
    error,
    clearError: () => {
      setError(null)
      setLoadingState("idle")
    },
  }
}
