"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import type { SuperAdminInvitableRole } from "@/lib/super-admin-invitable-roles"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import { superAdminInviteService } from "@/services/super-admin-invite"

export function useInviteUser() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isInviting, error: rawError, reset } = useMutation({
    mutationFn: ({ email, role }: { email: string; role: SuperAdminInvitableRole }) =>
      superAdminInviteService.invite({ email: email.trim().toLowerCase(), role }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Invitation sent successfully")
      queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.users.all })
    },
    onError: (err: unknown) => {
      const m = getApiErrorToastMessage(err, "Failed to send invitation")
      if (m) toast.error(m)
    },
  })

  const invite = (email: string, role: SuperAdminInvitableRole) => mutateAsync({ email, role })
  const error = rawError instanceof Error ? rawError.message : rawError ? String(rawError) : null

  return { invite, isInviting, error, clearError: reset }
}
