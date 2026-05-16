import { portalApiClient } from "@/api/portal-api-client"
import type { ApiResponse } from "@/api/types"

export type AdminInvitableRole = "aggregator" | "logistics"

export type AdminInviteRequest = {
  email: string
  role: AdminInvitableRole
}

export type AdminInviteRecord = {
  id: number
  email: string
  role: string
  expires_at: string
}

const ADMIN_BASE = "/admin"

export const adminInviteApi = {
  invite(data: AdminInviteRequest): Promise<ApiResponse<AdminInviteRecord>> {
    return portalApiClient
      .post<ApiResponse<AdminInviteRecord>>(`${ADMIN_BASE}/invite`, data)
      .then((res) => res.data)
  },
}
