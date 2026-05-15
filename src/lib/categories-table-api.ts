import type { CategoryRecord } from "@/api/category-types"
import { ADMIN_TABLE_PAGE_SIZE } from "@/lib/pagination"
import { slugifyCategoryName } from "@/lib/category-utils"
import { categoriesService } from "@/services/categories"

export type CategoryFilters = {
  search: string
  sortOrder: "asc" | "desc"
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
}

export type CategoryRow = CategoryRecord & {
  slug: string
}

function toCategoryRow(record: CategoryRecord): CategoryRow {
  return {
    ...record,
    slug: record.slug ?? slugifyCategoryName(record.name),
  }
}

function filterBySearch(items: CategoryRow[], search: string) {
  const query = search.trim().toLowerCase()
  if (!query) return items

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.slug.toLowerCase().includes(query) ||
      String(item.id).includes(query)
  )
}

export type CategoryStatsSummary = {
  total: number
}

export async function fetchCategoryStats(): Promise<CategoryStatsSummary> {
  const result = await categoriesService.list({ page: 1, limit: 1, sort_order: "desc" })
  return { total: result.total }
}

export async function fetchCategoriesPage(
  page: number,
  filters: CategoryFilters
): Promise<PaginatedResult<CategoryRow>> {
  if (filters.search.trim()) {
    const result = await categoriesService.list({
      page: 1,
      limit: 500,
      sort_order: filters.sortOrder,
    })
    const rows = filterBySearch(result.items.map(toCategoryRow), filters.search)
    const start = (page - 1) * ADMIN_TABLE_PAGE_SIZE
    return {
      items: rows.slice(start, start + ADMIN_TABLE_PAGE_SIZE),
      total: rows.length,
    }
  }

  const result = await categoriesService.list({
    page,
    limit: ADMIN_TABLE_PAGE_SIZE,
    sort_order: filters.sortOrder,
  })

  return {
    items: result.items.map(toCategoryRow),
    total: result.total,
  }
}
