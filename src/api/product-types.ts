import type { ApiResponse } from "@/api/types"

export type ProductStatus = "pending" | "active" | "rejected"

export type ProductRecord = {
  id: number
  name: string
  description?: string | null
  sku?: string | null
  category_id: number
  low_stock_threshold?: number
  unit?: string
  status: ProductStatus
  compare_at_price?: string | null
  profit_margin?: string | null
  minimum_order_quantity?: number
  is_featured?: boolean
  is_organic?: boolean
  created_at?: string
  updated_at?: string
}

export type CreateProductRequest = {
  name: string
  description?: string
  sku?: string
  category_id: number
  low_stock_threshold?: number
  unit?: string
  status?: ProductStatus
  compare_at_price?: string
  profit_margin?: string
  minimum_order_quantity?: number
  is_featured?: boolean
  is_organic?: boolean
  file_ids?: number[]
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export type ProductsListParams = {
  limit?: number
  offset?: number
  category_id?: number
  status?: ProductStatus
  unit?: string
  is_featured?: boolean
  is_organic?: boolean
  search?: string
  sort_by?: "created_at" | "name"
  sort_order?: "asc" | "desc"
}

export type ProductsListMeta = {
  /** Documented field */
  total?: number
  /** Current API returns page row count as `count` */
  count?: number
  limit: number
  offset: number
}

export type ProductsListResponse = {
  data: ProductRecord[]
  meta?: ProductsListMeta
  success: boolean
  message?: string
}

export type ProductResponse = ApiResponse<ProductRecord>
