import type { ApiResponse } from "@/api/types"

export type UserProfilePicture = Record<string, unknown> | null

export type UserExtendedProfile = {
  id: number
  user_id: number
  profile_picture_id: string | number | null
  metadata: Record<string, unknown>
  profile_picture: UserProfilePicture
  created_at?: string
  updated_at?: string
}

/** GET /user/profile response `data` */
export type UserProfileRecord = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  country_code?: string | null
  role: string
  is_active: boolean
  is_email_verified: boolean
  created_at?: string
  updated_at?: string
  profile: UserExtendedProfile
}

export type UserProfileResponse = ApiResponse<UserProfileRecord>
