import type { CategoriesListParams, CategoriesListResponse } from "@/api/category-types"
import { ApiError } from "@/api/types"
import type { ApiErrorResponse } from "@/api/types"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app"

const REQUEST_TIMEOUT_MS = 15_000

function parseResponse<TResponse>(status: number, raw: string): TResponse {
  const payload = raw ? (JSON.parse(raw) as TResponse & ApiErrorResponse) : ({} as TResponse)

  if (status < 200 || status >= 300) {
    const message =
      (payload as ApiErrorResponse)?.message || `Request failed with status ${status}`
    throw new ApiError(status, message, payload as ApiErrorResponse)
  }

  return payload as TResponse
}

/** Backend expects GET /categories with a JSON body; browsers send that via XHR. */
export function fetchCategoriesList(
  params: CategoriesListParams,
  authorization?: string
): Promise<CategoriesListResponse> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/categories`
  const body = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort_order: params.sort_order ?? "desc",
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.timeout = REQUEST_TIMEOUT_MS
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Accept", "application/json")

    if (authorization) {
      xhr.setRequestHeader("Authorization", authorization)
    }

    xhr.onload = () => {
      try {
        resolve(parseResponse<CategoriesListResponse>(xhr.status, xhr.responseText))
      } catch (error) {
        reject(error)
      }
    }

    xhr.onerror = () => {
      reject(new Error("Network error while loading categories"))
    }

    xhr.ontimeout = () => {
      reject(new Error("Categories request timed out"))
    }

    xhr.send(JSON.stringify(body))
  })
}
