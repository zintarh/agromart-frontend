import { authApi } from "@/api/auth"
import type { User } from "@/api/types"
import { extractAuthPayload } from "@/lib/extract-auth-payload"
import {
  clearSuperAdminTokens,
  getSuperAdminUser,
  setSuperAdminTokens,
  setSuperAdminUser,
} from "@/utils/super-admin-storage"

export const superAdminAuthService = {
  /**
   * Login super admin via the same auth endpoint; tokens are stored separately.
   */
  async login(email: string, password: string) {
    const response = await authApi.login({ email, password })
    const tokenData = extractAuthPayload(response)

    if (tokenData?.access_token && tokenData?.refresh_token) {
      setSuperAdminTokens(tokenData.access_token, tokenData.refresh_token)
      if (tokenData.user) {
        setSuperAdminUser(tokenData.user)
      }
    } else if (import.meta.env.DEV) {
      console.warn("[Auth] Login response did not include tokens", response)
    }

    return response
  },

  logout() {
    clearSuperAdminTokens()
  },

  getCurrentUser(): User | null {
    return getSuperAdminUser<User>()
  },
}
