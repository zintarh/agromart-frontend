import { superAdminUsersApi } from "@/api/super-admin-users"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"

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
      default:
        return fetchList(() => superAdminUsersApi.listUsers())
    }
  },

  async listUsers(): Promise<SuperAdminUserRecord[]> {
    return this.listByRole("user")
  },

  async promoteToSuperAdmin(userId: number) {
    return superAdminUsersApi.promoteToSuperAdmin(userId)
  },
}
