import type { Customer, CustomerStatus } from "@/components/super-admin/customer-management/mock-customers"
import type { SuperAdminUserRecord } from "@/api/super-admin-types"

const AVATAR_COLORS = [
  "#E8F5E9",
  "#E3F2FD",
  "#FFF3E0",
  "#F3E5F5",
  "#E8EAF6",
  "#FCE4EC",
] as const

function formatJoinedDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "0"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0)
  const last = lastName.trim().charAt(0)
  const initials = `${first}${last}`.toUpperCase()
  return initials || "?"
}

export function mapSuperAdminUserToCustomer(
  user: SuperAdminUserRecord,
  index = 0
): Customer {
  const status: CustomerStatus = user.is_active ? "active" : "suspended"

  return {
    id: String(user.id),
    name: `${user.first_name} ${user.last_name}`.trim() || user.email,
    initials: getInitials(user.first_name, user.last_name),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    email: user.email,
    phone: user.phone?.trim() || "0",
    joined: formatJoinedDate(user.created_at),
    createdAt: user.created_at,
    role: user.role,
    emailVerified: user.is_email_verified,
    orders: 0,
    status,
    totalSpent: "0",
  }
}
