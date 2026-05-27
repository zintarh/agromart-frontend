"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import { superAdminUsersService } from "@/services/super-admin-users"

export function usePromoteAdmin() {
  const queryClient = useQueryClient()

  const { mutateAsync: promote, isPending: isPromoting } = useMutation({
    mutationFn: (userId: number) => superAdminUsersService.promoteToSuperAdmin(userId),
    onSuccess: (res) => {
      toast.success(res.message ?? "User promoted to super admin")
      queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.users.all })
    },
    onError: (err: unknown) => {
      const m = getApiErrorToastMessage(err, "Failed to promote user")
      if (m) toast.error(m)
    },
  })

  return { promote, isPromoting }
}
