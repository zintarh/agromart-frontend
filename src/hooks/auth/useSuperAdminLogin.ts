import { useState } from "react"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { superAdminAuthService } from "@/services/super-admin-auth"
import { useAdminStore } from "@/store/adminStore"
import type { AdminUser } from "@/types/admin-user"
import type { LoadingState } from "@/types/loading"

export function useSuperAdminLogin() {
  const setSession = useAdminStore((state) => state.setSession)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await superAdminAuthService.login(email, password)
      setSession((extractAuthPayload(response)?.user as AdminUser | undefined) ?? null)
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please check your credentials."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  return {
    login,
    loadingState,
    error,
    clearError: () => {
      setError(null)
      setLoadingState("idle")
    },
  }
}
