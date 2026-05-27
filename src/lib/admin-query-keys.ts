import type { AdminUserRole } from "@/services/admin-users"

export const adminQueryKeys = {
  all: ["admin"] as const,
  users: {
    all: ["admin", "users"] as const,
    byRole: (role: AdminUserRole) => ["admin", "users", role] as const,
  },
}
