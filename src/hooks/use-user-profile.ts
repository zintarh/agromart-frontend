"use client"

import { useCallback, useEffect, useState } from "react"

import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { userProfileService } from "@/services/user-profile"
import type { LoadingState } from "@/types/loading"

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>("idle")
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const id = Number(userId)
    if (!userId || Number.isNaN(id)) {
      setProfile(null)
      setError("Invalid user id.")
      setLoadingState("error")
      return
    }

    setLoadingState("loading")
    setError(null)

    try {
      const data = await userProfileService.getCustomerProfile(id)
      setProfile(data)
      setLoadingState("success")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load user profile. Please try again."
      setProfile(null)
      setError(message)
      setLoadingState("error")
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  return {
    profile,
    error,
    isLoading: loadingState === "loading",
    isNotFound: loadingState === "error" && !profile,
    reload: load,
  }
}
