import type { ApiResponse } from "@/api/types"

export type CategoryRecord = {
  id: number
  name: string
  slug?: string
  description?: string | null
  created_by?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export type CategoriesListParams = {
  page?: number
  limit?: number
  sort_order?: "asc" | "desc"
}

export type CategoriesListMeta = {
  total: number
  page: number
  last_page: number
}

export type CategoriesListResponse = ApiResponse<CategoryRecord[]> & {
  meta?: CategoriesListMeta
}

export type CreateCategoryRequest = {
  category_name: string
}

export type UpdateCategoryRequest = {
  category_name: string
}
