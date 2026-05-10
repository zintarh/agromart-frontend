/**
 * Axios API client with interceptors for auth flow
 */

import axios, { AxiosError } from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { ApiError } from "./types"
import type { ApiErrorResponse } from "./types"
import { getAccessToken, setTokens, clearTokens } from "@/utils/storage"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app/"

/**
 * Create axios instance with default config
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  /**
   * Request interceptor - Add auth token to requests
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  /**
   * Response interceptor - Handle errors and token refresh
   */
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Handle 401 - Try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Only refresh if we have a refresh token
          const refreshToken = localStorage.getItem("refresh_token")
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            })

            const { access_token, refresh_token } = response.data.data
            setTokens(access_token, refresh_token)

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return client(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens
          clearTokens()
          // Optionally redirect to login
          window.dispatchEvent(new Event("unauthorized"))
        }
      }

      // Format error response
      const errorResponse = error.response?.data as ApiErrorResponse | undefined
      const message =
        errorResponse?.message ||
        error.message ||
        "An error occurred. Please try again."

      throw new ApiError(
        error.response?.status || 500,
        message,
        errorResponse
      )
    }
  )

  return client
}

export const apiClient = createApiClient()
