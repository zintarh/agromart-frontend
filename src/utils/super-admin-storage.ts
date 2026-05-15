const SUPER_ADMIN_ACCESS_TOKEN_KEY = "super_admin_access_token"
const SUPER_ADMIN_REFRESH_TOKEN_KEY = "super_admin_refresh_token"
const SUPER_ADMIN_USER_KEY = "super_admin_user"

const isBrowser = typeof window !== "undefined"

export function getSuperAdminAccessToken(): string | null {
  return isBrowser ? localStorage.getItem(SUPER_ADMIN_ACCESS_TOKEN_KEY) : null
}

export function getSuperAdminRefreshToken(): string | null {
  return isBrowser ? localStorage.getItem(SUPER_ADMIN_REFRESH_TOKEN_KEY) : null
}

export function setSuperAdminTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser) return
  localStorage.setItem(SUPER_ADMIN_ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(SUPER_ADMIN_REFRESH_TOKEN_KEY, refreshToken)
}

export function clearSuperAdminTokens(): void {
  if (!isBrowser) return
  localStorage.removeItem(SUPER_ADMIN_ACCESS_TOKEN_KEY)
  localStorage.removeItem(SUPER_ADMIN_REFRESH_TOKEN_KEY)
  localStorage.removeItem(SUPER_ADMIN_USER_KEY)
}

export function isSuperAdminAuthenticated(): boolean {
  return !!getSuperAdminAccessToken()
}

export function setSuperAdminUser(user: unknown): void {
  if (!isBrowser) return
  localStorage.setItem(SUPER_ADMIN_USER_KEY, JSON.stringify(user))
}

export function getSuperAdminUser<T = unknown>(): T | null {
  if (!isBrowser) return null
  const user = localStorage.getItem(SUPER_ADMIN_USER_KEY)
  return user ? (JSON.parse(user) as T) : null
}
