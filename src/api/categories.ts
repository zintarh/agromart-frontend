import { fetchCategoriesList } from "@/api/categories-list-request"
import { portalApiClient } from "@/api/portal-api-client"
import type {
  CategoriesListParams,
  CategoriesListResponse,
  CategoryRecord,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/category-types"
import { ApiError } from "@/api/types"
import type { ApiErrorResponse, ApiResponse } from "@/api/types"
import { getPortalAuthHeaders, getPortalAuthorizationHeader } from "@/lib/portal-auth"

const CATEGORIES_BASE = "/categories"
const CATEGORIES_LIST_PROXY = "/api/categories/list"
const PROXY_TIMEOUT_MS = 8_000

async function fetchCategoriesListViaProxy(
  params: CategoriesListParams
): Promise<CategoriesListResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    sort_order: params.sort_order ?? "desc",
  })

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS)

  try {
    const response = await fetch(`${CATEGORIES_LIST_PROXY}?${query}`, {
      headers: getPortalAuthHeaders({ Accept: "application/json" }),
      signal: controller.signal,
    })

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      throw new Error("Categories proxy returned a non-JSON response")
    }

    const payload = (await response.json()) as CategoriesListResponse & ApiErrorResponse

    if (!response.ok) {
      throw new ApiError(
        response.status,
        payload?.message || `Request failed with status ${response.status}`,
        payload as ApiErrorResponse
      )
    }

    return payload as CategoriesListResponse
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function assertPortalAuth(): void {
  if (!getPortalAuthorizationHeader()) {
    throw new ApiError(
      401,
      "You are not signed in. Please log in again at the admin portal.",
      { message: "Unauthorized", success: false }
    )
  }
}

export const categoriesApi = {
  async list(params: CategoriesListParams = {}): Promise<CategoriesListResponse> {
    try {
      return await fetchCategoriesListViaProxy(params)
    } catch {
      return fetchCategoriesList(params, getPortalAuthorizationHeader())
    }
  },

  create(data: CreateCategoryRequest): Promise<ApiResponse<CategoryRecord>> {
    assertPortalAuth()
    return portalApiClient
      .post<ApiResponse<CategoryRecord>>(`${CATEGORIES_BASE}/create`, data, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  update(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<CategoryRecord>> {
    assertPortalAuth()
    return portalApiClient
      .patch<ApiResponse<CategoryRecord>>(`${CATEGORIES_BASE}/${id}`, data, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  remove(id: number): Promise<ApiResponse> {
    assertPortalAuth()
    return portalApiClient
      .delete<ApiResponse>(`${CATEGORIES_BASE}/${id}`, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },
}
