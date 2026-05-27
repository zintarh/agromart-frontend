import axios from "axios"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import {
  getPortalRefreshToken,
  setPortalTokens,
} from "@/lib/portal-auth"

let refreshInFlight: Promise<{ access_token: string; refresh_token: string }> | null =
  null

/**
 * Deduplicates concurrent 401 refresh attempts so one failure does not log everyone out.
 */
export async function refreshPortalAccessToken(
  apiBaseUrl: string
): Promise<{ access_token: string; refresh_token: string }> {
  if (refreshInFlight) {
    return refreshInFlight
  }

  refreshInFlight = (async () => {
    const refreshToken = getPortalRefreshToken()
    if (!refreshToken) {
      throw new Error("No refresh token")
    }

    const response = await axios.post(`${apiBaseUrl}/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })

    const tokens = extractAuthPayload(response.data)
    if (!tokens?.access_token || !tokens?.refresh_token) {
      throw new Error("Invalid refresh response")
    }

    setPortalTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  })()

  try {
    return await refreshInFlight
  } finally {
    refreshInFlight = null
  }
}
