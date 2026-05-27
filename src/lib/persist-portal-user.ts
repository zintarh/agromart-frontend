import type { AdminUser } from "@/types/admin-user"
import { setUser } from "@/utils/storage"
import { setSuperAdminUser } from "@/utils/super-admin-storage"

/** Keep main + legacy super-admin user keys in sync. */
export function persistPortalUser(user: AdminUser | null): void {
  if (!user) return
  setUser(user)
  setSuperAdminUser(user)
}
