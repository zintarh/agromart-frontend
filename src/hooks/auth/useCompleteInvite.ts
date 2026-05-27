"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { authService } from "@/services/auth"
import { useAdminStore } from "@/store/adminStore"
import { useSessionStore } from "@/store/sessionStore"
import type { AdminUser } from "@/types/admin-user"
import { isPortalRole } from "@/lib/portal-roles"

export type CompleteInvitePayload = {
  token: string
  first_name: string
  last_name: string
  password: string
  phone?: string
  country_code?: string
}

export function useCompleteInvite() {
  const { mutateAsync, isPending, error: rawError, reset } = useMutation({
    mutationFn: (data: CompleteInvitePayload) => authService.completeInvite(data),
    onSuccess: (response) => {
      const user = authService.getCurrentUser()
      if (user) {
        useSessionStore.getState().setSession(user)
        if (isPortalRole(user.role)) {
          useAdminStore.getState().setSession(user as AdminUser)
        }
      }
      toast.success(response.message ?? "Registration completed successfully")
    },
  })

  const completeInvite = (data: CompleteInvitePayload) =>
    mutateAsync(data).then((response) => ({ response, user: authService.getCurrentUser() }))

  const error = rawError instanceof Error
    ? rawError.message
    : rawError ? "Failed to complete registration. Please try again." : null

  return {
    completeInvite,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: reset,
  }
}
