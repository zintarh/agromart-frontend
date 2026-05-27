"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { adminInviteApi } from "@/api/admin-invite"
import { getApiErrorToastMessage } from "@/api/types"
import type { AdminInvitableRole } from "@/lib/admin-invitable-roles"
import { adminQueryKeys } from "@/lib/admin-query-keys"

export function useAdminInvite() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isInviting } = useMutation({
    mutationFn: ({ email, role }: { email: string; role: AdminInvitableRole }) =>
      adminInviteApi.invite({ email: email.trim().toLowerCase(), role }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Invitation sent successfully")
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.all })
    },
    onError: (err: unknown) => {
      const m = getApiErrorToastMessage(err, "Failed to send invitation")
      if (m) toast.error(m)
    },
  })

  const invite = (email: string, role: AdminInvitableRole) => mutateAsync({ email, role })

  return { invite, isInviting }
}
