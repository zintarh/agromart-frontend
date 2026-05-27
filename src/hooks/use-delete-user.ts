"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import { superAdminUsersService } from "@/services/super-admin-users"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (userId: number) => superAdminUsersService.deactivateUser(userId),
    onSuccess: (res) => {
      toast.success(res.message ?? "User deactivated")
      queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.users.all })
    },
    onError: (err: unknown) => {
      const m = getApiErrorToastMessage(err, "Failed to deactivate user")
      if (m) toast.error(m)
    },
  })

  return { deleteUser, isDeleting }
}
