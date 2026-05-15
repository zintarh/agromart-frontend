import { superAdminApiClient } from "@/api/super-admin-client"
import type { SuperAdminUsersListResponse } from "@/api/super-admin-types"
import type { ApiResponse } from "@/api/types"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"

const SUPER_ADMIN_BASE = "/super-admin"

export const superAdminUsersApi = {
  listUsers(): Promise<SuperAdminUsersListResponse> {
    return superAdminApiClient.get(`${SUPER_ADMIN_BASE}/users`).then((res) => res.data)
  },

  listAdmins(): Promise<SuperAdminUsersListResponse> {
    return superAdminApiClient.get(`${SUPER_ADMIN_BASE}/admins`).then((res) => res.data)
  },

  listAggregators(): Promise<SuperAdminUsersListResponse> {
    return superAdminApiClient.get(`${SUPER_ADMIN_BASE}/aggregators`).then((res) => res.data)
  },

  listLogistics(): Promise<SuperAdminUsersListResponse> {
    return superAdminApiClient.get(`${SUPER_ADMIN_BASE}/logistics`).then((res) => res.data)
  },

  listSuperAdmins(): Promise<SuperAdminUsersListResponse> {
    return superAdminApiClient.get(`${SUPER_ADMIN_BASE}/super-admins`).then((res) => res.data)
  },

  promoteToSuperAdmin(userId: number): Promise<ApiResponse<SuperAdminUserRecord>> {
    return superAdminApiClient
      .patch<ApiResponse<SuperAdminUserRecord>>(`${SUPER_ADMIN_BASE}/users/${userId}/promote`)
      .then((res) => res.data)
  },
}
