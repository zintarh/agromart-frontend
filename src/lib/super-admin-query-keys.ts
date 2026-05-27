import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import type { CustomerFilters } from "@/lib/super-admin-table-api"

export const superAdminQueryKeys = {
  all: ["super-admin"] as const,
  users: {
    all: ["super-admin", "users"] as const,
    byRole: (role: SuperAdminUserListRole) => ["super-admin", "users", role] as const,
  },
  customers: {
    page: (role: SuperAdminUserListRole, page: number, filters: CustomerFilters) =>
      ["super-admin", "customers", role, page, filters] as const,
  },
}
