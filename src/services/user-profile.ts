import { userProfileApi, fetchUserProfileViaProxy } from "@/api/user-profile"
import type { UserProfileRecord } from "@/api/user-profile-types"
import { ApiError } from "@/api/types"
import { mapUserProfileToCustomerProfile } from "@/lib/map-user-profile-to-customer-profile"
import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import { superAdminUsersService } from "@/services/super-admin-users"

const LIST_ROLES: SuperAdminUserListRole[] = [
  "user",
  "admin",
  "aggregator",
  "logistics",
  "super_admin",
]

function extractProfileRecord(response: { data?: unknown }): UserProfileRecord | null {
  const data = response.data
  if (!data || typeof data !== "object") return null
  return data as UserProfileRecord
}

async function findUserInLists(userId: number): Promise<SuperAdminUserRecord | undefined> {
  for (const role of LIST_ROLES) {
    try {
      const users = await superAdminUsersService.listByRole(role)
      const hit = users.find((user) => user.id === userId)
      if (hit) return hit
    } catch {
      // continue
    }
  }

  return undefined
}

function buildProfileFromListUser(user: SuperAdminUserRecord): CustomerProfile {
  return mapUserProfileToCustomerProfile({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active,
    is_email_verified: user.is_email_verified,
    created_at: user.created_at,
    profile: {
      id: 0,
      user_id: user.id,
      profile_picture_id: null,
      metadata: {},
      profile_picture: null,
    },
  })
}

export const userProfileService = {
  async getCustomerProfile(userId: number): Promise<CustomerProfile> {
    const errors: unknown[] = []

    for (const fetcher of [
      () => fetchUserProfileViaProxy(userId),
      () => userProfileApi.getProfile(userId),
    ]) {
      try {
        const response = await fetcher()
        const record = extractProfileRecord(response)
        if (record) {
          return mapUserProfileToCustomerProfile(record)
        }
      } catch (error) {
        errors.push(error)
        if (error instanceof ApiError && error.statusCode === 404) {
          break
        }
      }
    }

    const listUser = await findUserInLists(userId)
    if (listUser) {
      return buildProfileFromListUser(listUser)
    }

    const lastError = errors[errors.length - 1]
    if (lastError instanceof Error) {
      throw lastError
    }

    throw new Error("User profile not found.")
  },
}
