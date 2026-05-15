export const superAdminComingSoonMeta = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview and analytics",
  },
  orders: {
    title: "Order",
    subtitle: "Manage customer orders",
  },
  delivery: {
    title: "Delivery",
    subtitle: "Delivery partners and logistics",
  },
  payment: {
    title: "Payment",
    subtitle: "Payments and transactions",
  },
  "promo-codes": {
    title: "Promo code",
    subtitle: "Promotions and discount codes",
  },
  vendors: {
    title: "Vendor",
    subtitle: "Vendor accounts and listings",
  },
  applications: {
    title: "Application",
    subtitle: "Vendor applications",
  },
  "sub-admins": {
    title: "Sub-Admins",
    subtitle: "Admin team access",
  },
  reports: {
    title: "Report",
    subtitle: "Reports and insights",
  },
  notifications: {
    title: "Notification",
    subtitle: "Alerts and announcements",
  },
  settings: {
    title: "Settings",
    subtitle: "Portal configuration",
  },
} as const

export type SuperAdminComingSoonKey = keyof typeof superAdminComingSoonMeta
