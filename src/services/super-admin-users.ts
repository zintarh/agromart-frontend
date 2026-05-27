import { superAdminUsersApi } from "@/api/super-admin-users"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"

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

  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: SuperAdminUserRecord[] }).data
  }

  return []
}

async function fetchList(
  fetcher: () => Promise<unknown>
): Promise<SuperAdminUserRecord[]> {
  const response = await fetcher()
  return extractUserList(response)
}

export const superAdminUsersService = {
  async listByRole(role: SuperAdminUserListRole): Promise<SuperAdminUserRecord[]> {
    switch (role) {
      case "user":
        return fetchList(() => superAdminUsersApi.listUsers())
      case "admin":
        return fetchList(() => superAdminUsersApi.listAdmins())
      case "aggregator":
        return fetchList(() => superAdminUsersApi.listAggregators())
      case "logistics":
        return fetchList(() => superAdminUsersApi.listLogistics())
      case "super_admin":
        return fetchList(() => superAdminUsersApi.listSuperAdmins())
    }
  },

  async promoteToSuperAdmin(userId: number) {
    return superAdminUsersApi.promoteToSuperAdmin(userId)
  },

  async deactivateUser(userId: number) {
    return superAdminUsersApi.deactivateUser(userId)
  },
}
