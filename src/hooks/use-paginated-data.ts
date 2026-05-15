import { useEffect, useMemo, useState } from "react"

import {
  ADMIN_TABLE_PAGE_SIZE,
  getTotalPages,
  paginateItems,
} from "@/lib/pagination"

export function usePaginatedData<T>(
  items: T[],
  pageSize = ADMIN_TABLE_PAGE_SIZE
) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = getTotalPages(items.length, pageSize)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedItems = useMemo(
    () => paginateItems(items, currentPage, pageSize),
    [items, currentPage, pageSize]
  )

  return {
    paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
  }
}
