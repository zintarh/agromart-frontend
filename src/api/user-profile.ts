import { superAdminApiClient } from "@/api/super-admin-client"
import type { UserProfileResponse } from "@/api/user-profile-types"
import { getPortalAuthHeaders } from "@/lib/portal-auth"

const USER_PROFILE_PATH = "/user/profile"

export const userProfileApi = {
  /** Fetch profile for a user (portal). Passes `user_id` for admin detail views. */
  getProfile(userId: number): Promise<UserProfileResponse> {
    return superAdminApiClient
      .get<UserProfileResponse>(USER_PROFILE_PATH, {
        params: { user_id: userId },
      })
      .then((res) => res.data)
  },
}

const PROFILE_PROXY = "/api/user/profile"

/** Browser fetch via same-origin proxy (forwards Authorization). */
export async function fetchUserProfileViaProxy(userId: number): Promise<UserProfileResponse> {
  const query = new URLSearchParams({ user_id: String(userId) })
  const response = await fetch(`${PROFILE_PROXY}?${query.toString()}`, {
    method: "GET",
    headers: getPortalAuthHeaders({ Accept: "application/json" }),
  })

  const payload = (await response.json()) as UserProfileResponse

  if (!response.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : `Failed to load profile (${response.status})`
    throw new Error(message)
  }

  return payload
}
