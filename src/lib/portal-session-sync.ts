import { isClient } from "@/lib/auth-guard"
import { canAccessPortal } from "@/lib/portal-roles"
import { getPortalAccessToken } from "@/lib/portal-auth"
import type { AdminUser } from "@/types/admin-user"
import { getUser } from "@/utils/storage"
import { getSuperAdminUser } from "@/utils/super-admin-storage"
import { useAdminStore } from "@/store/adminStore"

/** Align Zustand portal session with localStorage before route guards run. */
export function syncPortalSessionFromStorage(): AdminUser | null {
  if (!isClient) {
    return useAdminStore.getState().user
  }

  const token = getPortalAccessToken()
  const storedUser = (getUser() as AdminUser | null) ?? getSuperAdminUser<AdminUser>()

  if (token && canAccessPortal(storedUser)) {
    const current = useAdminStore.getState().user
    if (current?.id !== storedUser?.id || current?.role !== storedUser?.role) {
      useAdminStore.getState().setSession(storedUser)
    }
    return storedUser
  }

  if (useAdminStore.getState().isAuthenticated || useAdminStore.getState().user) {
    useAdminStore.getState().clearSession()
  }

  return null
}
