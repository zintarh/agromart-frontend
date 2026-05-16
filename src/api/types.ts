/**
 * Type definitions for Auth API
 */

// User types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "user" | "aggregator" | "admin"
  is_email_verified?: boolean
  is_active?: boolean
}

export interface UserProfile extends User {
  profile?: {
    id: number
    user_id: number
    profile_picture_id: string | null
    metadata: Record<string, any>
    profile_picture: string | null
  }
}

// Request types
export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string
  country_code?: string
}

export interface VerifyEmailRequest {
  email: string
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  new_password: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface CompleteInviteRequest {
  token: string
  first_name: string
  last_name: string
  password: string
  phone?: string
  country_code?: string
}

// Response types
export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  success: boolean
}

export interface RegisterResponse extends ApiResponse {
  data?: {
    email: string
  }
}

export interface VerifyEmailResponse extends ApiResponse {
  data?: AuthResponse
}

export interface LoginResponse extends ApiResponse {
  data?: AuthResponse
}

export interface RefreshTokenResponse extends ApiResponse {
  data?: AuthTokens
}

export interface MeResponse extends ApiResponse {
  data?: UserProfile
}

// Error types
export interface ApiErrorResponse {
  message: string
  success: false
  data?: any
}

export class ApiError extends Error {
  /** Set when a global portal listener already surfaced this permission error. */
  public readonly permissionDenied: boolean

  constructor(
    public statusCode: number,
    message: string,
    public errorResponse?: ApiErrorResponse,
    options?: { permissionDenied?: boolean }
  ) {
    super(message)
    this.name = "ApiError"
    this.permissionDenied = options?.permissionDenied ?? false
  }
}

export function getApiErrorToastMessage(err: unknown, fallback: string): string | null {
  if (err instanceof ApiError && err.permissionDenied) {
    return null
  }
  return err instanceof Error ? err.message : fallback
}
