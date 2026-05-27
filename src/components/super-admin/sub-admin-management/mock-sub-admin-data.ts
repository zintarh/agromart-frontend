export type SubAdminRoleId = "user_admin" | "farmer_vendor_admin"

export type SubAdminAccount = {
  id: string
  name: string
  email: string
  roleId: SubAdminRoleId
  addedOn: string
  status: "active" | "inactive"
  initials: string
  avatarColor: string
  avatarTextColor?: string
}

export type RolePermissionColumn = {
  id: string
  title: string
  permissions: string[]
}

export const subAdminAccounts: SubAdminAccount[] = [
  {
    id: "1",
    name: "Fatima Usman",
    email: "fatima@agrofarm.ng",
    roleId: "user_admin",
    addedOn: "Mar 1, 2026",
    status: "active",
    initials: "FU",
    avatarColor: "#1E3A5F",
    avatarTextColor: "#FFFFFF",
  },
  {
    id: "2",
    name: "Chukwuemeka Okafor",
    email: "chukwu@agrofarm.ng",
    roleId: "farmer_vendor_admin",
    addedOn: "Mar 1, 2026",
    status: "active",
    initials: "CO",
    avatarColor: "#2D5A27",
    avatarTextColor: "#FFFFFF",
  },
]

export const rolePermissionColumns: RolePermissionColumn[] = [
  {
    id: "super_admin",
    title: "Super Admin",
    permissions: [
      "Full platform access",
      "Manage sub-admins",
      "Approve vendors",
      "Payment & refunds",
      "System settings",
      "Export all reports",
    ],
  },
  {
    id: "user_admin",
    title: "User Admin",
    permissions: [
      "View all customers",
      "Suspend / enable",
      "View order history",
      "Payment & refunds",
      "System settings",
      "Export all reports",
    ],
  },
  {
    id: "farmer_vendor_admin",
    title: "Farmer/Vendor Admin",
    permissions: [
      "Review application",
      "Approve/reject",
      "Manage vendor product",
      "Payment & refunds",
      "System settings",
      "Export all reports",
    ],
  },
]

export const subAdminRoleLabels: Record<SubAdminRoleId, string> = {
  user_admin: "USER ADMIN",
  farmer_vendor_admin: "FARMER / VENDOR ADMIN",
}
