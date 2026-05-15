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
  "/super-admin/products",
  "/super-admin/categories",
  "/super-admin/users",
] as const

export const superAdminNavSections: SidebarNavSectionConfig[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/super-admin/dashboard" },
      { label: "Order", icon: ClipboardList, to: "/super-admin/orders" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", icon: Package, to: "/super-admin/products" },
      { label: "Categories", icon: FolderTree, to: "/super-admin/categories" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Delivery", icon: Truck, to: "/super-admin/delivery" },
      { label: "Users", icon: Users, to: "/super-admin/users" },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Payment", icon: Wallet, to: "/super-admin/payment" },
      { label: "Promo code", icon: Tag, to: "/super-admin/promo-codes" },
    ],
  },
  {
    title: "Vendor Portal",
    items: [
      { label: "Vendor", icon: ShoppingBag, to: "/super-admin/vendors" },
      { label: "Application", icon: FileText, to: "/super-admin/applications" },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Sub-Admins", icon: Shield, to: "/super-admin/sub-admins" },
      { label: "Report", icon: FileText, to: "/super-admin/reports" },
      { label: "Notification", icon: Bell, to: "/super-admin/notifications" },
      { label: "Settings", icon: Settings, to: "/super-admin/settings" },
    ],
  },
]

export const superAdminNavRoutes = superAdminNavSections.flatMap((section) =>
  section.items.map((item) => item.to)
)

function matchesNavRoute(pathname: string, route: string) {
  if (NESTED_ACTIVE_PREFIXES.includes(route as (typeof NESTED_ACTIVE_PREFIXES)[number])) {
    return pathname === route || pathname.startsWith(`${route}/`)
  }
  return pathname === route
}

/** Returns the single nav route that should be active, if any. */
export function getActiveSidebarRoute(pathname: string) {
  const matches = superAdminNavRoutes.filter((route) => matchesNavRoute(pathname, route))
  if (matches.length === 0) return undefined

  return matches.sort((a, b) => b.length - a.length)[0]
}

export function isSidebarNavActive(pathname: string, to: string) {
  return getActiveSidebarRoute(pathname) === to
}
