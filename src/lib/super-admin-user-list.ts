/** Role keys returned by super-admin user list endpoints. */
export type SuperAdminUserListRole =
  | "user"
  | "admin"
  | "aggregator"
  | "logistics"
  | "super_admin"

/** URL search tab ids for customer management. */
export type UserManagementTabId =
  | "customers"
  | "admins"
  | "aggregators"
  | "logistics"
  | "super-admins"

export type UserManagementTab = {
  id: UserManagementTabId
  label: string
  role: SuperAdminUserListRole
  statsLabel: string
  emptyMessage: string
  tableTitle: string
}

export const USER_MANAGEMENT_TABS: UserManagementTab[] = [
  {
    id: "customers",
    label: "Customers",
    role: "user",
    statsLabel: "Total Customers",
    emptyMessage: "No customers found.",
    tableTitle: "Customer Accounts",
  },
  {
    id: "admins",
    label: "Admins",
    role: "admin",
    statsLabel: "Total Admins",
    emptyMessage: "No admins found.",
    tableTitle: "Admin Accounts",
  },
  {
    id: "aggregators",
    label: "Aggregators",
    role: "aggregator",
    statsLabel: "Total Aggregators",
    emptyMessage: "No aggregators found.",
    tableTitle: "Aggregator Accounts",
  },
  {
    id: "logistics",
    label: "Logistics",
    role: "logistics",
    statsLabel: "Total Logistics",
    emptyMessage: "No logistics users found.",
    tableTitle: "Logistics Accounts",
  },
  {
    id: "super-admins",
    label: "Super Admins",
    role: "super_admin",
    statsLabel: "Total Super Admins",
    emptyMessage: "No super admins found.",
    tableTitle: "Super Admin Accounts",
  },
]

export const DEFAULT_USER_MANAGEMENT_TAB: UserManagementTabId = "customers"

export function getUserManagementTab(id?: string): UserManagementTab {
  return (
    USER_MANAGEMENT_TABS.find((tab) => tab.id === id) ??
    USER_MANAGEMENT_TABS[0]
  )
}

export function isCustomerTab(tab: UserManagementTab): boolean {
  return tab.role === "user"
}
