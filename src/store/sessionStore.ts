import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { User } from "@/api/types"
import { logAuthUser } from "@/lib/log-auth-user"
import { getUser, isAuthenticated } from "@/utils/storage"

interface SessionState {
  user: User | null
  isAuthenticated: boolean
  setSession: (user: User | null) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setSession: (user) => {
          logAuthUser("Customer session", user)
          set({ user, isAuthenticated: !!user })
        },
        clearSession: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: "session-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          const token = isAuthenticated()
          const user = getUser()
          if (token) {
            state.setSession(user)
          }
        },
      }
    ),
    { name: "SessionStore" }
  )
)

export const useSessionUser = () => useSessionStore((state) => state.user)
export const useIsAuthenticated = () => useSessionStore((state) => state.isAuthenticated)
