"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { superAdminUsersService } from "@/services/super-admin-users"
import type { LoadingState } from "@/types/loading"

export function usePromoteAdmin() {
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")

  const promote = useCallback(async (userId: number) => {
    setLoadingState("loading")
    try {
      const response = await superAdminUsersService.promoteToSuperAdmin(userId)
      toast.success(response.message ?? "User promoted to super admin")
      setLoadingState("success")
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to promote user"
      toast.error(message)
      setLoadingState("error")
      throw err
    } finally {
      setLoadingState("idle")
    }
  }, [])

  return {
    promote,
    isPromoting: loadingState === "loading",
  }
}
