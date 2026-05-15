import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import { loadSuperAdminUsersByRole } from "@/lib/super-admin-users-cache"
import type { Product } from "@/components/super-admin/product-catalog/mock-products"
import { products } from "@/components/super-admin/product-catalog/mock-products"
import { ADMIN_TABLE_PAGE_SIZE } from "@/lib/pagination"

export type CustomerFilters = {
  status: string
  dateRange: string
  search: string
}

export type ProductFilters = {
  category: string
  status: string
  vendor: string
  search: string
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
}

function paginateSlice<T>(items: T[], page: number) {
  const start = (page - 1) * ADMIN_TABLE_PAGE_SIZE
  return items.slice(start, start + ADMIN_TABLE_PAGE_SIZE)
}

function getProductStatus(product: Product) {
  if (product.stock === 0) return "out-of-stock"
  if (product.stock < 15) return "low-stock"
  return "active"
}

function filterCustomers(all: Customer[], filters: CustomerFilters) {
  let result = all

  if (filters.status !== "all") {
    result = result.filter((customer) => customer.status === filters.status)
  }

  if (filters.dateRange !== "all") {
    result = result.filter((customer) => {
      if (customer.createdAt) {
        return customer.createdAt.includes(filters.dateRange)
      }
      return customer.joined.includes(filters.dateRange)
    })
  }

  if (filters.search.trim()) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
    )
  }

  return result
}

function filterProducts(all: Product[], filters: ProductFilters) {
  let result = all

  if (filters.category !== "all") {
    result = result.filter((product) => product.category === filters.category)
  }

  if (filters.vendor !== "all") {
    result = result.filter((product) => product.vendor === filters.vendor)
  }

  if (filters.status !== "all") {
    result = result.filter((product) => getProductStatus(product) === filters.status)
  }

  if (filters.search.trim()) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.vendor.toLowerCase().includes(query)
    )
  }

  return result
}

export type CustomerStatsSummary = {
  total: number
  active: number
  suspended: number
  verified: number
}

export async function fetchCustomerStats(
  role: SuperAdminUserListRole = "user"
): Promise<CustomerStatsSummary> {
  const all = await loadSuperAdminUsersByRole(role)
  const active = all.filter((customer) => customer.status === "active").length
  const verified = all.filter((customer) => customer.emailVerified).length
  return {
    total: all.length,
    active,
    suspended: all.length - active,
    verified,
  }
}

export async function fetchCustomersPage(
  page: number,
  filters: CustomerFilters,
  role: SuperAdminUserListRole = "user"
): Promise<PaginatedResult<Customer>> {
  const all = await loadSuperAdminUsersByRole(role)
  const filtered = filterCustomers(all, filters)
  return {
    items: paginateSlice(filtered, page),
    total: filtered.length,
  }
}

export type ProductStatsSummary = {
  total: number
  active: number
  outOfStock: number
  lowStock: number
}

export async function fetchProductStats(): Promise<ProductStatsSummary> {
  const active = products.filter((product) => getProductStatus(product) === "active").length
  const outOfStock = products.filter((product) => product.stock === 0).length
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock < 15
  ).length

  return {
    total: products.length,
    active,
    outOfStock,
    lowStock,
  }
}

export async function fetchProductsPage(
  page: number,
  filters: ProductFilters
): Promise<PaginatedResult<Product>> {
  const filtered = filterProducts(products, filters)
  return {
    items: paginateSlice(filtered, page),
    total: filtered.length,
  }
}
