import { useMutation } from "@tanstack/react-query"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { superAdminAuthService } from "@/services/super-admin-auth"
import { useAdminStore } from "@/store/adminStore"
import type { AdminUser } from "@/types/admin-user"

export function useSuperAdminLogin() {
  const setSession = useAdminStore((state) => state.setSession)

  const { mutateAsync, isPending, error: rawError, reset } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      superAdminAuthService.login(email, password),
    onSuccess: (response) => {
      setSession((extractAuthPayload(response)?.user as AdminUser | undefined) ?? null)
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
