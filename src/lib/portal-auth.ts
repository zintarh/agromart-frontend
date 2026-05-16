import type { InternalAxiosRequestConfig } from "axios"

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/utils/storage"
import {
  clearSuperAdminTokens,
  getSuperAdminAccessToken,
  getSuperAdminRefreshToken,
  setSuperAdminTokens,
} from "@/utils/super-admin-storage"

/**
 * Portal auth uses the main app token store (shared login for admin + super_admin).
 * Falls back to legacy super-admin keys until users re-login.
 */
export function getPortalAccessToken(): string | null {
  return getAccessToken() ?? getSuperAdminAccessToken()
}

export function getPortalRefreshToken(): string | null {
  return getRefreshToken() ?? getSuperAdminRefreshToken()
}

export function setPortalTokens(accessToken: string, refreshToken: string): void {
  setTokens(accessToken, refreshToken)
  setSuperAdminTokens(accessToken, refreshToken)
}

export function clearPortalTokens(): void {
  clearSuperAdminTokens()
  clearTokens()
}

export function getPortalAuthorizationHeader(): string | undefined {
  const token = getPortalAccessToken()
  return token ? `Bearer ${token}` : undefined
}

export function getPortalAuthHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const headers = { ...extra }
  const authorization = getPortalAuthorizationHeader()

  if (authorization) {
    headers.Authorization = authorization
  }

  return headers
}

export function applyPortalAuthToRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const authorization = getPortalAuthorizationHeader()

  if (!authorization) {
    return config
  }

  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", authorization)
  } else {
    config.headers.Authorization = authorization
  }

  return config
}
