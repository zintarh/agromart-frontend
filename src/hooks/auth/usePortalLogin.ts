"use client"

import { useMutation } from "@tanstack/react-query"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { getLoginErrorMessage } from "@/lib/login-errors"
import { isPortalRole } from "@/lib/portal-roles"
import { portalAuthService } from "@/services/portal-auth"
import { useAdminStore } from "@/store/adminStore"
import type { AdminUser } from "@/types/admin-user"

export function usePortalLogin() {
  const setSession = useAdminStore((state) => state.setSession)

  const { mutateAsync, isPending, error: rawError, reset } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      portalAuthService.login(email, password),
    onSuccess: (response) => {
      const user = extractAuthPayload(response)?.user as AdminUser | undefined
      if (!user || !isPortalRole(user.role)) {
        throw new Error("This account does not have access to the admin portal.")
      }
      setSession(user)
    },
  })

  const login = (email: string, password: string) => mutateAsync({ email, password })
  const error = rawError ? getLoginErrorMessage(rawError) : null

  return {
    login,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: reset,
  }
}
