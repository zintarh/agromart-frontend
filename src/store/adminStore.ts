import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import { logAuthUser } from "@/lib/log-auth-user"
import { canAccessPortal } from "@/lib/portal-roles"
import { getPortalAccessToken } from "@/lib/portal-auth"
import type { AdminUser } from "@/types/admin-user"
import { getUser } from "@/utils/storage"
import { getSuperAdminUser } from "@/utils/super-admin-storage"
import { clearPortalTokens } from "@/lib/portal-auth"

function getStoredAdminUser(): AdminUser | null {
  return (getUser() as AdminUser | null) ?? getSuperAdminUser<AdminUser>()
}

interface AdminState {
  user: AdminUser | null
  isAuthenticated: boolean
  setSession: (user: AdminUser | null) => void
  clearSession: () => void
}

const initialUser = getStoredAdminUser()

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set) => ({
        user: canAccessPortal(initialUser) ? initialUser : null,
        isAuthenticated: canAccessPortal(initialUser) && !!getPortalAccessToken(),
        setSession: (user) => {
          logAuthUser("Admin portal session", user)
          set({
            user: canAccessPortal(user) ? user : null,
            isAuthenticated: canAccessPortal(user) && !!getPortalAccessToken(),
          })
        },
        clearSession: () => {
          clearPortalTokens()
          set({ user: null, isAuthenticated: false })
        },
      }),
      {
        name: "admin-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          const user = getStoredAdminUser()
          if (getPortalAccessToken() && canAccessPortal(user)) {
            state.setSession(user)
          }
        },
      }
    ),
    { name: "AdminStore" }
  )
)

export const useAdminUser = () => useAdminStore((state) => state.user)
export const useIsAdminAuthenticated = () => useAdminStore((state) => state.isAuthenticated)
