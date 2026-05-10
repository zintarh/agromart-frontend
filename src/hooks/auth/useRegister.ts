import { useState } from "react"
import { authService } from "@/services/auth"
import type { LoadingState } from "@/types/loading"

type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string
  country_code?: string
}

export function useRegister() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const register = async (data: RegisterPayload) => {
    setLoadingState("loading")
    setError(null)
    try {
      const response = await authService.register(data)
      setLoadingState("success")
      return response
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again."
      setError(message)
      setLoadingState("error")
      throw err
    }
  }

  return {
    register,
    loadingState,
    error,
    clearError: () => {
      setError(null)
      setLoadingState("idle")
    },
  }
}
