/**
 * API client for super-admin requests (uses super-admin tokens only).
 */

import axios, { AxiosError } from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"

import { ApiError } from "./types"
import type { ApiErrorResponse } from "./types"
import { extractAuthPayload } from "@/lib/extract-auth-payload"
import {
  clearSuperAdminTokens,
  getSuperAdminAccessToken,
  getSuperAdminRefreshToken,
  setSuperAdminTokens,
} from "@/utils/super-admin-storage"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app/"

function createSuperAdminApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getSuperAdminAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = getSuperAdminRefreshToken()
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            })

            const tokens = extractAuthPayload(response.data)
            if (!tokens?.access_token || !tokens?.refresh_token) {
              throw new Error("Invalid refresh response")
            }
            setSuperAdminTokens(tokens.access_token, tokens.refresh_token)

            originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
            return client(originalRequest)
          }
        } catch {
          clearSuperAdminTokens()
          window.dispatchEvent(new Event("super-admin-unauthorized"))
        }
      }

      const errorResponse = error.response?.data as ApiErrorResponse | undefined
      const message =
        errorResponse?.message || error.message || "An error occurred. Please try again."

      throw new ApiError(error.response?.status || 500, message, errorResponse)
    }
  )

  return client
}

export const superAdminApiClient = createSuperAdminApiClient()
