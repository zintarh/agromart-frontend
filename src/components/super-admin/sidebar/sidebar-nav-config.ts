import type { LucideIcon } from "lucide-react"
import {
  Bell,
  ClipboardList,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
  Users,
  Wallet,
} from "lucide-react"

import {
  canAccessAdminOperations,
  canAccessSuperAdminOperations,
} from "@/lib/portal-roles"
import type { AdminUser } from "@/types/admin-user"

export type SidebarNavItemConfig = {
  label: string
  icon: LucideIcon
  to: string
}

export type SidebarNavSectionConfig = {
  title: string
  items: SidebarNavItemConfig[]
}

/** Routes where child paths belong to the same nav item (e.g. /products/new). */
const NESTED_ACTIVE_PREFIXES = [
  "/admin/products",
  "/admin/categories",
  "/admin/users",
] as const

/** Operations routes — admin role only (catalog, orders, commerce). */
const adminOperationsSections: SidebarNavSectionConfig[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
      { label: "Order", icon: ClipboardList, to: "/admin/orders" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", icon: Package, to: "/admin/products" },
      { label: "Categories", icon: FolderTree, to: "/admin/categories" },
    ],
  },
  {
    title: "People",
    items: [{ label: "Delivery", icon: Truck, to: "/admin/delivery" }],
  },
  {
    title: "Commerce",
    items: [
      { label: "Payment", icon: Wallet, to: "/admin/payment" },
      { label: "Promo code", icon: Tag, to: "/admin/promo-codes" },
    ],
  },
  {
    title: "Vendor Portal",
    items: [
      { label: "Vendor", icon: ShoppingBag, to: "/admin/vendors" },
      { label: "Application", icon: FileText, to: "/admin/applications" },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Sub-Admins", icon: Shield, to: "/admin/sub-admins" },
      { label: "Report", icon: FileText, to: "/admin/reports" },
      { label: "Notification", icon: Bell, to: "/admin/notifications" },
      { label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  },
]

/** User management — super_admin role only. */
const superAdminSections: SidebarNavSectionConfig[] = [
  {
    title: "People",
    items: [{ label: "Users", icon: Users, to: "/admin/users" }],
  },
]

export function getPortalNavSections(user: AdminUser | null | undefined): SidebarNavSectionConfig[] {
  const sections: SidebarNavSectionConfig[] = []

  if (canAccessSuperAdminOperations(user)) {
    sections.push(...superAdminSections)
  }

  if (canAccessAdminOperations(user)) {
    sections.push(...adminOperationsSections)
  }

  return sections
}

/** @deprecated Use getPortalNavSections(user) */
export const superAdminNavSections = adminOperationsSections

export function getPortalNavRoutes(user: AdminUser | null | undefined): string[] {
  return getPortalNavSections(user).flatMap((section) => section.items.map((item) => item.to))
}

function matchesNavRoute(pathname: string, route: string) {
  if (NESTED_ACTIVE_PREFIXES.includes(route as (typeof NESTED_ACTIVE_PREFIXES)[number])) {
    return pathname === route || pathname.startsWith(`${route}/`)
  }
  return pathname === route
}

/** Returns the single nav route that should be active, if any. */
export function getActiveSidebarRoute(pathname: string, user?: AdminUser | null) {
  const routes = user ? getPortalNavRoutes(user) : getPortalNavRoutes(null)
  const matches = routes.filter((route) => matchesNavRoute(pathname, route))
  if (matches.length === 0) return undefined

  return matches.sort((a, b) => b.length - a.length)[0]
}

export function isSidebarNavActive(
  pathname: string,
  to: string,
  user?: AdminUser | null
) {
  return getActiveSidebarRoute(pathname, user) === to
}
