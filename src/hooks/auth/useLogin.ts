import { useState } from "react"
import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { authService } from "@/services/auth"
import { useSessionStore } from "@/store/sessionStore"
import type { LoadingState } from "@/types/loading"

export function useLogin() {
  const setSession = useSessionStore((state) => state.setSession)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.login(email, password)
      setSession(extractAuthPayload(response)?.user ?? null)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Login failed. Please check your credentials."
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
