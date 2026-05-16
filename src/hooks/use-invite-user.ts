"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import type { SuperAdminInvitableRole } from "@/lib/super-admin-invitable-roles"
import { superAdminInviteService } from "@/services/super-admin-invite"
import type { LoadingState } from "@/types/loading"

export function useInviteUser() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const invite = useCallback(async (email: string, role: SuperAdminInvitableRole) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await superAdminInviteService.invite({
        email: email.trim().toLowerCase(),
        role,
      })
      toast.success(response.message ?? "Invitation sent successfully")
      setLoadingState("idle")
      return response
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to send invitation")
      if (message) toast.error(message)
      setError(message)
      setLoadingState("error")
      throw err
    }
  }, [])

  return {
    invite,
    isInviting: loadingState === "loading",
    error,
    clearError: () => setError(null),
  }
}
