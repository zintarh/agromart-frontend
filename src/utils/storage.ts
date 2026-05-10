const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_KEY = "current_user"

const isBrowser = typeof window !== "undefined"

export function getAccessToken(): string | null {
  return isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
}

export function getRefreshToken(): string | null {
  return isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser) return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  if (!isBrowser) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

export function setUser(user: any): void {
  if (!isBrowser) return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser() {
  if (!isBrowser) return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}
