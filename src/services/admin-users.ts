import { adminApi } from "@/api/admin"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"

export type AdminUserRole = "aggregator" | "logistics"

function extractUserList(data: unknown): SuperAdminUserRecord[] {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "data" in data
      ? (data as { data: unknown }).data
      : null
  return Array.isArray(list) ? (list as SuperAdminUserRecord[]) : []
}

async function fetchList(
  fetcher: () => Promise<{ data?: unknown }>
): Promise<SuperAdminUserRecord[]> {
  const response = await fetcher()
  return extractUserList(response.data)
}

export const adminUsersService = {
  listAggregators(): Promise<SuperAdminUserRecord[]> {
    return fetchList(() => adminApi.getAggregators())
  },

  listLogistics(): Promise<SuperAdminUserRecord[]> {
    return fetchList(() => adminApi.getLogistics())
  },
}
