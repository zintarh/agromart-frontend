export const ADMIN_TABLE_PAGE_SIZE = 10

export type PaginationPage = number | "..."

export function getTotalPages(itemCount: number, pageSize: number) {
  return Math.max(1, Math.ceil(itemCount / pageSize))
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number
): PaginationPage[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}

export function paginateItems<T>(items: T[], currentPage: number, pageSize: number) {
  const start = (currentPage - 1) * pageSize
  return items.slice(start, start + pageSize)
}
