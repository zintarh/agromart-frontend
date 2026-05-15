"use client"

import { useEffect, useRef, useState } from "react"

import { ADMIN_TABLE_PAGE_SIZE, getTotalPages } from "@/lib/pagination"
import type { PaginatedResult } from "@/lib/super-admin-table-api"

export function usePaginatedFetch<T, F extends object>(
  fetchPage: (page: number, filters: F) => Promise<PaginatedResult<T>>,
  filters: F,
  refreshKey = 0
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const filtersKey = JSON.stringify(filters)
  const prevFiltersKeyRef = useRef(filtersKey)
  const fetchPageRef = useRef(fetchPage)
  const filtersRef = useRef(filters)

  fetchPageRef.current = fetchPage
  filtersRef.current = filters

  useEffect(() => {
    let cancelled = false

    const filtersChanged = prevFiltersKeyRef.current !== filtersKey
    if (filtersChanged) {
      prevFiltersKeyRef.current = filtersKey
      if (currentPage !== 1) {
        setCurrentPage(1)
        return
      }
    }

    const pageToFetch = filtersChanged ? 1 : currentPage

    void (async () => {
      try {
        const result = await fetchPageRef.current(pageToFetch, filtersRef.current)
        if (!cancelled) {
          setItems(result.items)
          setTotalCount(result.total)
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [currentPage, filtersKey, refreshKey])

  const totalPages = getTotalPages(totalCount, ADMIN_TABLE_PAGE_SIZE)

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalCount, totalPages])

  return {
    items,
    currentPage,
    totalPages,
    setCurrentPage,
    isInitialLoading,
    totalCount,
  }
}
