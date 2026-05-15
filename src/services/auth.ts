
import { authApi } from "@/api/auth"
import type { User } from "@/api/types"
import { extractAuthPayload } from "@/lib/extract-auth-payload"
import { setTokens, clearTokens, setUser, getUser } from "@/utils/storage"

export const authService = {
  /**
   * Register new user
   */
  async register(data: {
    first_name: string
    last_name: string
    email: string
    password: string
    phone: string
    country_code?: string
  }) {
    const response = await authApi.register(data)
    return response
  },

  /**
   * Verify email with OTP
   * Stores tokens and user data on success
   */
  async verifyEmail(email: string, token: string) {
    const response = await authApi.verifyEmail({ email, token })
    const tokenData = extractAuthPayload(response)
    if (tokenData?.access_token && tokenData?.refresh_token) {
      setTokens(tokenData.access_token, tokenData.refresh_token)
      setUser(tokenData.user)
    }
    return response
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    return authApi.resendVerification({ email })
  },

  /**
   * Login user
   * Stores tokens and user data on success
   */
  async login(email: string, password: string) {
    const response = await authApi.login({ email, password })
    const tokenData = extractAuthPayload(response)
    if (tokenData?.access_token && tokenData?.refresh_token) {
      setTokens(tokenData.access_token, tokenData.refresh_token)
      setUser(tokenData.user)
    }
    return response
  },

  
  async forgotPassword(email: string) {
    return authApi.forgotPassword({ email })
  },


  async resetPassword(email: string, token: string, newPassword: string) {
    return authApi.resetPassword({
      email,
      token,
      new_password: newPassword,
    })
  },

  
  async completeInvite(data: {
    token: string
    first_name: string
    last_name: string
    password: string
    phone?: string
    country_code?: string
  }) {
    const response = await authApi.completeInvite(data)
    if (response.data?.access_token && response.data?.refresh_token) {
      const { access_token, refresh_token, user } = response.data
      setTokens(access_token, refresh_token)
      setUser(user)
    }
    return response
  },


  async getMe() {
    return authApi.getMe()
  },

 
  logout() {
    clearTokens()
  },


  getCurrentUser(): User | null {
    return getUser()
  },
}
