import type { ApiResponse } from "@/api/types"

/** User record returned by GET /super-admin/admins, /users, etc. */
export type SuperAdminUserRecord = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: string
  is_active: boolean
  is_email_verified: boolean
  created_at: string
}

export type SuperAdminUsersListResponse = ApiResponse<SuperAdminUserRecord[]>
