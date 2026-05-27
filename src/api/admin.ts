import { portalApiClient } from "@/api/portal-api-client"
import type { SuperAdminUsersListResponse } from "@/api/super-admin-types"

const ADMIN_BASE = "/admin"

export const adminApi = {
  getAggregators(): Promise<SuperAdminUsersListResponse> {
    return portalApiClient.get(`${ADMIN_BASE}/aggregators`).then((res) => res.data)
  },

  getLogistics(): Promise<SuperAdminUsersListResponse> {
    return portalApiClient.get(`${ADMIN_BASE}/logistics`).then((res) => res.data)
  },
}
