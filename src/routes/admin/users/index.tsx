import { createFileRoute } from "@tanstack/react-router"

import { CustomerManagementPage } from "@/components/super-admin/customer-management/customer-management-page"
import {
  DEFAULT_USER_MANAGEMENT_TAB,
  USER_MANAGEMENT_TABS,
  type UserManagementTabId,
} from "@/lib/super-admin-user-list"
import { ensureSuperAdminOperationsAccess } from "@/lib/portal-route-guard"

const VALID_TAB_IDS = new Set(USER_MANAGEMENT_TABS.map((tab) => tab.id))

export type UsersSearch = {
  tab?: UserManagementTabId
}

export const Route = createFileRoute("/admin/users/")({
  beforeLoad: () => {
    ensureSuperAdminOperationsAccess()
  },
  validateSearch: (search: Record<string, unknown>): UsersSearch => {
    const result: UsersSearch = {}

    if (typeof search.tab === "string" && VALID_TAB_IDS.has(search.tab as UserManagementTabId)) {
      result.tab = search.tab as UserManagementTabId
    } else {
      result.tab = DEFAULT_USER_MANAGEMENT_TAB
    }

    return result
  },
  component: CustomerManagementPage,
})
