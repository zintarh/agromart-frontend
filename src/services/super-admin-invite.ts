import { superAdminInviteApi } from "@/api/super-admin-invite"
import type { SuperAdminInviteRequest } from "@/api/super-admin-invite"

export const superAdminInviteService = {
  invite(data: SuperAdminInviteRequest) {
    return superAdminInviteApi.invite(data)
  },
}
