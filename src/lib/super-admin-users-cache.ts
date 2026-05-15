import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import { mapSuperAdminUserToCustomer } from "@/lib/map-super-admin-user-to-customer"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import { superAdminUsersService } from "@/services/super-admin-users"

const cache = new Map<SuperAdminUserListRole, Customer[]>()
const loadPromises = new Map<SuperAdminUserListRole, Promise<Customer[]>>()

export async function loadSuperAdminUsersByRole(
  role: SuperAdminUserListRole
): Promise<Customer[]> {
  const cached = cache.get(role)
  if (cached) {
    return cached
  }

  let promise = loadPromises.get(role)
  if (!promise) {
    promise = superAdminUsersService
      .listByRole(role)
      .then((users) => {
        const mapped = users.map((user, index) => mapSuperAdminUserToCustomer(user, index))
        cache.set(role, mapped)
        return mapped
      })
      .catch((error) => {
        loadPromises.delete(role)
        throw error
      })

    loadPromises.set(role, promise)
  }

  return promise
}

/** @deprecated Use loadSuperAdminUsersByRole("user") */
export async function loadSuperAdminCustomers(): Promise<Customer[]> {
  return loadSuperAdminUsersByRole("user")
}

export function invalidateSuperAdminUsersCache(role?: SuperAdminUserListRole): void {
  if (role) {
    cache.delete(role)
    loadPromises.delete(role)
    return
  }

  cache.clear()
  loadPromises.clear()
}
