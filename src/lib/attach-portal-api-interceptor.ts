import axios, { AxiosError } from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"

import { extractAuthPayload } from "@/lib/extract-auth-payload"
import {
  dispatchPortalUnauthorized,
  getAxiosErrorMessage,
  isPortalRoleAuthorizationError,
  rejectPortalAxiosError,
} from "@/lib/portal-api-errors"
import {
  applyPortalAuthToRequest,
  clearPortalTokens,
  getPortalRefreshToken,
  setPortalTokens,
} from "@/lib/portal-auth"

export function attachPortalApiResponseInterceptor(
  client: AxiosInstance,
  apiBaseUrl: string
): void {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const message = getAxiosErrorMessage(error)
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (isPortalRoleAuthorizationError(status, message)) {
        return rejectPortalAxiosError(error)
      }

      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true

        try {
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
          applyPortalAuthToRequest(originalRequest)
          return client(originalRequest)
        } catch {
          clearPortalTokens()
          dispatchPortalUnauthorized()
          return Promise.reject(error)
        }
      }

      return rejectPortalAxiosError(error)
    }
  )
}
