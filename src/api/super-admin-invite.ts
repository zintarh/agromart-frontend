import { superAdminApiClient } from "@/api/super-admin-client"
import type { SuperAdminInvitableRole } from "@/lib/super-admin-invitable-roles"
import type { ApiResponse } from "@/api/types"

export type SuperAdminInviteRequest = {
  email: string
  role: SuperAdminInvitableRole
}

export type SuperAdminInviteRecord = {
  id: number
  email: string
  role: string
  expires_at: string
}

const SUPER_ADMIN_BASE = "/super-admin"

export const superAdminInviteApi = {
  invite(data: SuperAdminInviteRequest): Promise<ApiResponse<SuperAdminInviteRecord>> {
    return superAdminApiClient
      .post<ApiResponse<SuperAdminInviteRecord>>(`${SUPER_ADMIN_BASE}/invite`, data)
      .then((res) => res.data)
  },
}
