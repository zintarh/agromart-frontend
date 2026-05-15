import { fetchCategoriesList } from "@/api/categories-list-request"
import { superAdminApiClient } from "@/api/super-admin-client"
import type {
  CategoriesListParams,
  CategoriesListResponse,
  CategoryRecord,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/category-types"
import type { ApiResponse } from "@/api/types"
import { getSuperAdminAccessToken } from "@/utils/super-admin-storage"

const CATEGORIES_BASE = "/categories"
const CATEGORIES_LIST_PROXY = "/api/categories/list"
const PROXY_TIMEOUT_MS = 8_000

async function fetchCategoriesListViaProxy(
  params: CategoriesListParams,
  authorization?: string
): Promise<CategoriesListResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    sort_order: params.sort_order ?? "desc",
  })

  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  if (authorization) {
    headers.Authorization = authorization
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS)

  try {
    const response = await fetch(`${CATEGORIES_LIST_PROXY}?${query}`, {
      headers,
      signal: controller.signal,
    })

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      throw new Error("Categories proxy returned a non-JSON response")
    }

    const payload = (await response.json()) as CategoriesListResponse

    if (!response.ok) {
      throw new Error(payload?.message || `Request failed with status ${response.status}`)
    }

    return payload
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export const categoriesApi = {
  async list(params: CategoriesListParams = {}): Promise<CategoriesListResponse> {
    const token = getSuperAdminAccessToken()
    const authorization = token ? `Bearer ${token}` : undefined

    try {
      return await fetchCategoriesListViaProxy(params, authorization)
    } catch {
      return fetchCategoriesList(params, authorization)
    }
  },

  create(data: CreateCategoryRequest): Promise<ApiResponse<CategoryRecord>> {
    return superAdminApiClient
      .post<ApiResponse<CategoryRecord>>(`${CATEGORIES_BASE}/create`, data)
      .then((res) => res.data)
  },

  update(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<CategoryRecord>> {
    return superAdminApiClient
      .patch<ApiResponse<CategoryRecord>>(`${CATEGORIES_BASE}/${id}`, data)
      .then((res) => res.data)
  },

  remove(id: number): Promise<ApiResponse> {
    return superAdminApiClient
      .delete<ApiResponse>(`${CATEGORIES_BASE}/${id}`)
      .then((res) => res.data)
  },
}
