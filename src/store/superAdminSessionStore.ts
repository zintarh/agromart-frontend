import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

import type { User } from "@/api/types"
import { getSuperAdminUser, isSuperAdminAuthenticated } from "@/utils/super-admin-storage"

interface SuperAdminSessionState {
  user: User | null
  isAuthenticated: boolean
  setSession: (user: User | null) => void
  clearSession: () => void
}

const initialUser = getSuperAdminUser<User>()

export const useSuperAdminSessionStore = create<SuperAdminSessionState>()(
  devtools(
    persist(
      (set) => ({
        user: initialUser,
        isAuthenticated: !!initialUser,
        setSession: (user) => set({ user, isAuthenticated: !!user }),
        clearSession: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: "super-admin-session-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          if (isSuperAdminAuthenticated()) {
            state.setSession(getSuperAdminUser<User>())
          }
        },
      }
    ),
    { name: "SuperAdminSessionStore" }
  )
)
