import type { CustomerProfile, CustomerSavedAddress } from "@/components/super-admin/customer-management/mock-customer-profile"
import type { Customer, CustomerStatus } from "@/components/super-admin/customer-management/mock-customers"
import type { UserProfileRecord } from "@/api/user-profile-types"
import { displaySuperAdminValue } from "@/lib/super-admin-display"

const AVATAR_COLORS = [
  "#E8F5E9",
  "#E3F2FD",
  "#FFF3E0",
  "#F3E5F5",
  "#E8EAF6",
  "#FCE4EC",
] as const

function formatJoinedDate(isoDate?: string): string {
  if (!isoDate) return "—"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatJoinedDisplay(isoDate?: string): string {
  if (!isoDate) return "—"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0)
  const last = lastName.trim().charAt(0)
  const initials = `${first}${last}`.toUpperCase()
  return initials || "?"
}

function buildAddresses(metadata: Record<string, unknown>): CustomerSavedAddress[] {
  const meta = metadata as Record<string, string | undefined>
  const parts = [meta.address, meta.city, meta.state].filter(
    (part): part is string => typeof part === "string" && part.trim().length > 0
  )

  if (parts.length === 0) {
    return []
  }

  return [{ label: "HOME", address: parts.join(", ") }]
}

export function mapUserProfileToCustomerProfile(data: UserProfileRecord): CustomerProfile {
  const status: CustomerStatus = data.is_active ? "active" : "suspended"
  const name = `${data.first_name} ${data.last_name}`.trim() || data.email
  const initials = getInitials(data.first_name, data.last_name)
  const avatarColor = AVATAR_COLORS[data.id % AVATAR_COLORS.length]

  const base: Customer = {
    id: String(data.id),
    name,
    initials,
    avatarColor,
    email: data.email,
    phone: displaySuperAdminValue(data.phone),
    joined: formatJoinedDate(data.created_at),
    createdAt: data.created_at ?? "",
    role: data.role,
    emailVerified: data.is_email_verified,
    orders: 0,
    status,
    totalSpent: "0",
  }

  return {
    ...base,
    lastLogin: "—",
    joinedDisplay: formatJoinedDisplay(data.created_at),
    rating: 0,
    totalSpentShort: "₦0",
    summaryInitials: initials,
    summaryAvatarColor: "#2D5A27",
    orderHistory: [],
    addresses: buildAddresses(data.profile?.metadata ?? {}),
  }
}
