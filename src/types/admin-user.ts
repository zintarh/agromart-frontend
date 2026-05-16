/** Portal user returned from login (admin, super_admin, etc.). */
export type AdminPortalRole =
  | "super_admin"
  | "admin"
  | "aggregator"
  | "logistics"
  | "user"
  | string

export type AdminUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  role: AdminPortalRole
  phone?: string | null
  is_email_verified?: boolean
  is_active?: boolean
}

export function getAdminDisplayName(user: AdminUser | null | undefined): string {
  if (!user) return "Admin User"
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
  return name || user.email
}

export function getAdminInitials(user: AdminUser | null | undefined): string {
  if (!user) return "AD"

  const first = user.first_name?.trim().charAt(0) ?? ""
  const last = user.last_name?.trim().charAt(0) ?? ""

  if (first || last) {
    return `${first}${last}`.toUpperCase()
  }

  return user.email.charAt(0).toUpperCase() || "A"
}

export function getAdminRoleLabel(user: AdminUser | null | undefined): string {
  if (!user?.role) return "Admin"

  switch (user.role) {
    case "super_admin":
      return "Super Admin"
    case "admin":
      return "Admin"
    case "aggregator":
      return "Aggregator"
    case "logistics":
      return "Logistics"
    default:
      return user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }
}
