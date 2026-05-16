/**
 * API client for /super-admin/* endpoints (super_admin role only).
 */

import axios from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"

import { attachPortalApiResponseInterceptor } from "@/lib/attach-portal-api-interceptor"
import { applyPortalAuthToRequest } from "@/lib/portal-auth"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app/"

function createSuperAdminApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => applyPortalAuthToRequest(config),
    (error) => Promise.reject(error)
  )

  attachPortalApiResponseInterceptor(client, API_BASE_URL.replace(/\/$/, ""))

  return client
}

export const superAdminApiClient = createSuperAdminApiClient()
