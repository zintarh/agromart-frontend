import { ApiError } from "@/api/types"

/**
 * Parse login-specific error messages based on error type and status code
 */
export function getLoginErrorMessage(error: unknown): string {
  // Handle ApiError with specific status codes
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 401:
        return "Invalid email or password. Please check your credentials and try again."
      case 400:
        return error.message || "Invalid request. Please check your email and password."
      case 403:
        return "This account does not have access to the admin portal."
      case 404:
        return "User account not found. Please check your email and try again."
      case 429:
        return "Too many login attempts. Please try again later."
      case 500:
        return "Server error. Please try again later."
      default:
        return error.message || "Login failed. Please try again."
    }
  }

  // Handle standard Error
  if (error instanceof Error) {
    // Check for specific error messages from validation
    if (error.message.includes("admin portal")) {
      return "This account does not have access to the admin portal."
    }
    if (error.message.includes("credentials")) {
      return "Invalid email or password. Please check your credentials and try again."
    }
    return error.message
  }

  // Fallback for unknown errors
  return "Login failed. Please try again."
}
