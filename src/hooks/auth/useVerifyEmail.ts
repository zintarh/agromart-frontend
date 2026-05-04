import { useState } from "react"
import { authService } from "@/services/auth"
import { useSessionStore } from "@/store/sessionStore"
import type { LoadingState } from "@/types/loading"

export function useVerifyEmail() {
  const setSession = useSessionStore((state) => state.setSession)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const verifyEmail = async (email: string, token: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.verifyEmail(email, token)
      setSession(response.data?.user || null)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Verification failed. Please try again."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  const resendVerification = async (email: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.resendVerification(email)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Failed to resend verification code."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  return {
    verifyEmail,
    resendVerification,
    loadingState,
    error,
    clearError: () => {
      setError(null)
      setLoadingState("idle")
    },
  }
}
