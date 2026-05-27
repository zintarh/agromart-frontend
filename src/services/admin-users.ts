import { adminApi } from "@/api/admin"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"

export type AdminUserRole = "aggregator" | "logistics"

function extractUserList(payload: unknown): SuperAdminUserRecord[] {
  if (Array.isArray(payload)) {
    return payload as SuperAdminUserRecord[]
  }

  if (!payload || typeof payload !== "object") {
    return []
  }

  const record = payload as Record<string, unknown>
  const data = record.data

  if (Array.isArray(data)) {
    return data as SuperAdminUserRecord[]
  }

  return []
}

async function fetchList(
  fetcher: () => Promise<unknown>
): Promise<SuperAdminUserRecord[]> {
  const response = await fetcher()
  return extractUserList(response)
}

export const adminUsersService = {
  listAggregators(): Promise<SuperAdminUserRecord[]> {
    return fetchList(() => adminApi.getAggregators())
  },

  listLogistics(): Promise<SuperAdminUserRecord[]> {
    return fetchList(() => adminApi.getLogistics())
  },
}
