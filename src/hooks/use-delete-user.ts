"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { getApiErrorToastMessage } from "@/api/types"
import { superAdminUsersService } from "@/services/super-admin-users"
import type { LoadingState } from "@/types/loading"

export function useDeleteUser() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")

  const deleteUser = useCallback(async (userId: number) => {
    setLoadingState("loading")
    try {
      const response = await superAdminUsersService.deactivateUser(userId)
      toast.success(response.message ?? "User deleted")
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message = getApiErrorToastMessage(err, "Failed to delete user")
      if (message) toast.error(message)
      setLoadingState("error")
      throw err
    } finally {
      setLoadingState("idle")
    }
  }, [])

  return {
    deleteUser,
    isDeleting: loadingState === "loading",
  }
}
