import { useMutation } from "@tanstack/react-query"

import { authService } from "@/services/auth"

type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string
  country_code?: string
}

export function useRegister() {
  const { mutateAsync, isPending, error: rawError, reset } = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
  })

  const register = (data: RegisterPayload) => mutateAsync(data)
  const error = rawError instanceof Error
    ? rawError.message
    : rawError ? "Registration failed. Please try again." : null

  return {
    register,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: reset,
  }
}
