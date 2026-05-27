import type { ProductStatus } from "@/api/product-types"

/** Row model for the admin product catalog table. */
export type CatalogProduct = {
  id: string
  name: string
  category: string
  categoryId: number
  vendor: string
  stock: number | null
  price: string
  featured: boolean
  status: ProductStatus
  unit?: string
}

export type ProductFilters = {
  category: string
  status: string
  search: string
}

export type ProductStatsSummary = {
  total: number
  active: number
  pending: number
  rejected: number
}
