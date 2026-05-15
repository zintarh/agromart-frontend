"use client"

import { useEffect, useState } from "react"

export function useSuperAdminPageLoading(load?: () => Promise<unknown>) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        if (load) {
          await load()
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [load])

  return isLoading
}
