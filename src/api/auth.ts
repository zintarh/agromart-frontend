/**
 * Auth API endpoints
 */

import { apiClient } from "./client"
import type {
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CompleteInviteRequest,
  RegisterResponse,
  VerifyEmailResponse,
  LoginResponse,
  RefreshTokenResponse,
  MeResponse,
  ApiResponse,
} from "./types"

const AUTH_BASE = "/auth"

/**
 * Register a new user
 * Sends OTP to email
 */
export const authApi = {
  register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post(`${AUTH_BASE}/register`, data).then((res) => res.data)
  },

  /**
   * Verify email with OTP
   */
  verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return apiClient.post(`${AUTH_BASE}/verify-email`, data).then((res) => res.data)
  },

  /**
   * Resend email verification OTP
   */
  resendVerification(data: ResendVerificationRequest): Promise<ApiResponse> {
    return apiClient.post(`${AUTH_BASE}/resend-verification`, data).then((res) => res.data)
  },

  /**
   * Login with email and password
   */
  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post(`${AUTH_BASE}/login`, data).then((res) => res.data)
  },

  /**
   * Request password reset OTP
   */
  forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return apiClient.post(`${AUTH_BASE}/forgot-password`, data).then((res) => res.data)
  },

  /**
   * Reset password with OTP
   */
  resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return apiClient.post(`${AUTH_BASE}/reset-password`, data).then((res) => res.data)
  },

  /**
   * Refresh access token using refresh token
   * Requires refresh_token in Authorization header
   */
  refreshToken(): Promise<RefreshTokenResponse> {
    return apiClient.post(`${AUTH_BASE}/refresh`).then((res) => res.data)
  },

  /**
   * Complete registration from invitation
   */
  completeInvite(data: CompleteInviteRequest): Promise<VerifyEmailResponse> {
    return apiClient.post(`${AUTH_BASE}/complete-invite`, data).then((res) => res.data)
  },

  /**
   * Get current user profile
   * Requires valid access token
   */
  getMe(): Promise<MeResponse> {
    return apiClient.get(`${AUTH_BASE}/me`).then((res) => res.data)
  },
}
