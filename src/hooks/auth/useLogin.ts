import { useMutation } from "@tanstack/react-query"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { authService } from "@/services/auth"
import { useSessionStore } from "@/store/sessionStore"

export function useLogin() {
  const setSession = useSessionStore((state) => state.setSession)

  const { mutateAsync, isPending, error: rawError, reset } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (response) => {
      setSession(extractAuthPayload(response)?.user ?? null)
    },
  })

  const login = (email: string, password: string) => mutateAsync({ email, password })
  const error = rawError instanceof Error
    ? rawError.message
    : rawError ? "Login failed. Please check your credentials." : null

  return {
    login,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: reset,
  }
}
