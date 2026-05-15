import { categoriesApi } from "@/api/categories"
import type {
  CategoriesListMeta,
  CategoriesListParams,
  CategoriesListResponse,
  CategoryRecord,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/category-types"

export type CategoriesListResult = {
  items: CategoryRecord[]
  total: number
  page: number
  lastPage: number
}

type NestedListPayload = {
  data?: CategoryRecord[]
  meta?: CategoriesListMeta
}

function extractListPayload(response: CategoriesListResponse): {
  items: CategoryRecord[]
  meta?: CategoriesListMeta
} {
  const payload = response.data

  if (Array.isArray(payload)) {
    return { items: payload, meta: response.meta }
  }

  if (payload && typeof payload === "object") {
    const nested = payload as NestedListPayload
    const items = Array.isArray(nested.data) ? nested.data : []
    return { items, meta: nested.meta ?? response.meta }
  }

  return { items: [], meta: response.meta }
}

export const categoriesService = {
  async list(params: CategoriesListParams = {}): Promise<CategoriesListResult> {
    const response = await categoriesApi.list(params)
    const { items, meta } = extractListPayload(response)

    return {
      items,
      total: meta?.total ?? items.length,
      page: meta?.page ?? params.page ?? 1,
      lastPage: meta?.last_page ?? 1,
    }
  },

  async create(data: CreateCategoryRequest) {
    return categoriesApi.create(data)
  },

  async update(id: number, data: UpdateCategoryRequest) {
    return categoriesApi.update(id, data)
  },

  async remove(id: number) {
    return categoriesApi.remove(id)
  },
}
