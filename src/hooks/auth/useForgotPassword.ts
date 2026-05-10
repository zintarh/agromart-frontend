import { useState } from "react"
import { authService } from "@/services/auth"
import type { LoadingState } from "@/types/loading"

export function useForgotPassword() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const forgotPassword = async (email: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.forgotPassword(email)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Failed to send reset code. Please try again."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.resetPassword(email, token, newPassword)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Password reset failed. Please try again."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  return {
    forgotPassword,
    resetPassword,
    loadingState,
    error,
    clearError: () => {
      setError(null)
      setLoadingState("idle")
    },
  }
}
