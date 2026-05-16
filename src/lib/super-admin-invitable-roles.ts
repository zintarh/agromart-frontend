import type { UserManagementTabId } from "@/lib/super-admin-user-list"

/** Roles a super admin may assign via POST /super-admin/invite (backend SUPER_ADMIN_INVITABLE). */
export type SuperAdminInvitableRole = "admin" | "aggregator"

export const SUPER_ADMIN_INVITABLE_ROLES: {
  value: SuperAdminInvitableRole
  label: string
}[] = [
  { value: "admin", label: "Admin" },
  { value: "aggregator", label: "Aggregator" },
]

const TAB_DEFAULT_INVITE_ROLE: Partial<Record<UserManagementTabId, SuperAdminInvitableRole>> =
  {
    admins: "admin",
    aggregators: "aggregator",
  }

export function getDefaultInviteRoleForTab(
  tabId: UserManagementTabId
): SuperAdminInvitableRole {
  return TAB_DEFAULT_INVITE_ROLE[tabId] ?? "admin"
}

export function canInviteFromTab(tabId: UserManagementTabId): boolean {
  return tabId !== "super-admins"
}
