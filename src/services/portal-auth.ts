import { authApi } from "@/api/auth"
import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { setPortalTokens } from "@/lib/portal-auth"
import { persistPortalUser } from "@/lib/persist-portal-user"
import type { AdminUser } from "@/types/admin-user"
import { getUser } from "@/utils/storage"

export const portalAuthService = {
  async login(email: string, password: string) {
    const response = await authApi.login({ email, password })
    const tokenData = extractAuthPayload(response)

    if (tokenData?.access_token && tokenData?.refresh_token) {
      setPortalTokens(tokenData.access_token, tokenData.refresh_token)
      if (tokenData.user) {
        persistPortalUser(tokenData.user as AdminUser)
      }
    }

    return response
  },

  getCurrentUser(): AdminUser | null {
    return getUser() as AdminUser | null
  },
}
