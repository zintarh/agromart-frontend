import { getWithJsonBody } from "@/api/get-with-json-body"
import { superAdminApiClient } from "@/api/super-admin-client"
import type {
  CategoriesListParams,
  CategoriesListResponse,
  CategoryRecord,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/category-types"
import type { ApiResponse } from "@/api/types"

const CATEGORIES_BASE = "/categories"

export const categoriesApi = {
  list(params: CategoriesListParams = {}): Promise<CategoriesListResponse> {
    const body = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      sort_order: params.sort_order ?? "desc",
    }

    return getWithJsonBody<CategoriesListResponse>(superAdminApiClient, CATEGORIES_BASE, body)
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
