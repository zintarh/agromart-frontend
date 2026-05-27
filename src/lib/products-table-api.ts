import type { ProductRecord, ProductsListMeta } from "@/api/product-types"
import { ADMIN_TABLE_PAGE_SIZE } from "@/lib/pagination"
import type {
  CatalogProduct,
  ProductFilters,
  ProductStatsSummary,
} from "@/lib/product-catalog-types"
import { categoriesService } from "@/services/categories"
import { productsService } from "@/services/products"

export type { CatalogProduct, ProductFilters, ProductStatsSummary } from "@/lib/product-catalog-types"

export type PaginatedResult<T> = {
  items: T[]
  total: number
}

let categoryNameById: Map<number, string> | null = null

async function loadCategoryNameById(): Promise<Map<number, string>> {
  if (categoryNameById) return categoryNameById

  const result = await categoriesService.list({
    page: 1,
    limit: 500,
    sort_order: "asc",
  })
  categoryNameById = new Map(result.items.map((category) => [category.id, category.name]))
  return categoryNameById
}

export function invalidateProductCategoryCache(): void {
  categoryNameById = null
}

function formatCatalogPrice(compareAtPrice?: string | null): string {
  if (!compareAtPrice?.trim()) return "—"
  const amount = Number.parseFloat(compareAtPrice)
  if (!Number.isFinite(amount)) return compareAtPrice
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function mapProductRecord(
  record: ProductRecord,
  categories: Map<number, string>
): CatalogProduct {
  return {
    id: String(record.id),
    name: record.name,
    categoryId: record.category_id,
    category: categories.get(record.category_id) ?? `Category #${record.category_id}`,
    vendor: "—",
    stock: null,
    price: formatCatalogPrice(record.compare_at_price),
    featured: Boolean(record.is_featured),
    status: record.status,
    unit: record.unit,
  }
}

function buildListParams(page: number, filters: ProductFilters) {
  const limit = ADMIN_TABLE_PAGE_SIZE
  const offset = (page - 1) * limit

  const params: Parameters<typeof productsService.list>[0] = {
    limit,
    offset,
    sort_by: "created_at",
    sort_order: "desc",
  }

  const search = filters.search.trim()
  if (search) params.search = search

  if (filters.category !== "all") {
    const categoryId = Number.parseInt(filters.category, 10)
    if (Number.isFinite(categoryId)) {
      params.category_id = categoryId
    }
  }

  if (filters.status === "active" || filters.status === "pending" || filters.status === "rejected") {
    params.status = filters.status
  }

  return params
}

function extractListTotal(meta: ProductsListMeta | undefined, itemsLength: number): number {
  if (typeof meta?.total === "number") return meta.total
  if (typeof meta?.count === "number") return meta.count
  return itemsLength
}

export async function fetchProductStats(): Promise<ProductStatsSummary> {
  const response = await productsService.list({ limit: 9999, offset: 0, sort_by: "created_at", sort_order: "desc" })
  const { items, meta } = extractProductList(response)

  const total = typeof meta?.total === "number" ? meta.total : items.length
  const active = items.filter((p) => p.status === "active").length
  const pending = items.filter((p) => p.status === "pending").length
  const rejected = items.filter((p) => p.status === "rejected").length

  return { total, active, pending, rejected }
}

function extractProductList(response: Awaited<ReturnType<typeof productsService.list>>) {
  const payload = response.data
  if (Array.isArray(payload)) {
    return { items: payload, meta: response.meta }
  }
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: ProductRecord[] }).data)) {
    const nested = payload as { data: ProductRecord[]; meta?: typeof response.meta }
    return { items: nested.data, meta: nested.meta ?? response.meta }
  }
  return { items: [] as ProductRecord[], meta: response.meta }
}

export async function fetchProductsPage(
  page: number,
  filters: ProductFilters
): Promise<PaginatedResult<CatalogProduct>> {
  const [response, categories] = await Promise.all([
    productsService.list(buildListParams(page, filters)),
    loadCategoryNameById(),
  ])

  const { items: records, meta } = extractProductList(response)
  const items = records.map((record) => mapProductRecord(record, categories))

  return {
    items,
    total: extractListTotal(meta, items.length),
  }
}

export async function fetchProductCategoryFilterOptions() {
  const categories = await loadCategoryNameById()
  return [
    { value: "all", label: "All Categories" },
    ...Array.from(categories.entries()).map(([id, name]) => ({
      value: String(id),
      label: name,
    })),
  ]
}
