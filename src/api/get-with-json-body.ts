/**
 * Nest categories list uses GET with a JSON body (@Body() pagination).
 * Axios omits GET bodies in browsers; native fetch sends them reliably.
 */

import type { AxiosInstance } from "axios"

import { ApiError } from "@/api/types"
import type { ApiErrorResponse } from "@/api/types"
import { getSuperAdminAccessToken } from "@/utils/super-admin-storage"

export async function getWithJsonBody<TResponse>(
  client: AxiosInstance,
  url: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const baseURL = client.defaults.baseURL ?? ""
  const path = url.startsWith("/") ? url : `/${url}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const token = getSuperAdminAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${baseURL}${path}`, {
    method: "GET",
    headers,
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as TResponse & ApiErrorResponse

  if (!response.ok) {
    const message =
      (payload as ApiErrorResponse)?.message ||
      `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, payload as ApiErrorResponse)
  }

  return payload as TResponse
}
