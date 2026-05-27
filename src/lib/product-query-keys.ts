import type { ProductFilters } from "@/lib/product-catalog-types"

export const productQueryKeys = {
  all: ["products"] as const,
  stats: () => ["products", "stats"] as const,
  list: (page: number, filters: ProductFilters) =>
    ["products", "list", page, filters] as const,
  detail: (id: number) => ["products", "detail", id] as const,
}
