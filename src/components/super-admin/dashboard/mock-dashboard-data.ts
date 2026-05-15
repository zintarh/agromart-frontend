import { dashboardLinks } from "@/lib/dashboard-links"

export type DashboardTimePeriod = "today" | "week" | "month"

export type DashboardKpi = {
  label: string
  value: string
  trend?: string
  sublabel?: string
  sublabelClassName?: string
  to?: string
}

export type RevenuePoint = {
  day: string
  value: number
}

export type OrderStatusSegment = {
  label: string
  count: number
  percent: number
  color: string
}

export type RecentOrderRow = {
  orderId: string
  customer: string
  customerId?: string
  total: string
  status: "delivered" | "out-for-delivery" | "pending" | "confirmed" | "cancelled"
}

export type TopProductRow = {
  rank: number
  name: string
  unitsSold: number
  revenue: string
}

export type SalesCategoryRow = {
  name: string
  value: string
  percent: number
  barColor: string
}

export type DashboardSummaryCard = {
  icon: "truck" | "tag" | "card"
  iconBg: string
  iconColor: string
  value: string
  title: string
  footer: string
  footerClassName: string
  to: string
}

export const dashboardSubtitle = "Wednesday, Apr 13, 2026 - Live Data"

export const dashboardKpis: DashboardKpi[] = [
  { label: "Total Revenue", value: "N1,245,800", trend: "↑ 12% vs last week" },
  { label: "Total Order", value: "48", trend: "↑ 8% vs last week", to: dashboardLinks.orders },
  {
    label: "Registered Users",
    value: "156",
    trend: "↑ 15% vs last week",
    to: dashboardLinks.users,
  },
  {
    label: "Active Vendors",
    value: "29",
    sublabel: "3 Pending approval",
    sublabelClassName: "text-red-600",
    to: dashboardLinks.vendors,
  },
]

export const revenueLast7Days: RevenuePoint[] = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 48 },
  { day: "Wed", value: 72 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 95 },
]

export const orderStatusSegments: OrderStatusSegment[] = [
  { label: "Delivered", count: 45, percent: 60, color: "#2D5A27" },
  { label: "Confirmed", count: 45, percent: 60, color: "#60A5FA" },
  { label: "Out for Del", count: 45, percent: 60, color: "#1E40AF" },
  { label: "Pending", count: 45, percent: 60, color: "#EF4444" },
  { label: "Cancel", count: 45, percent: 60, color: "#F59E0B" },
]

export const recentOrders: RecentOrderRow[] = [
  {
    orderId: "#7891",
    customer: "Aminu Ibrahim",
    customerId: "1",
    total: "N12,950",
    status: "delivered",
  },
  {
    orderId: "#7888",
    customer: "Chioma Okafor",
    customerId: "4",
    total: "N8,400",
    status: "out-for-delivery",
  },
  {
    orderId: "#7885",
    customer: "John Smith",
    customerId: "2",
    total: "N5,200",
    status: "pending",
  },
  {
    orderId: "#7880",
    customer: "Blessing Bello",
    customerId: "3",
    total: "N15,800",
    status: "confirmed",
  },
  {
    orderId: "#7875",
    customer: "Emeka Nwosu",
    customerId: "5",
    total: "N3,500",
    status: "cancelled",
  },
]

export const topProducts: TopProductRow[] = [
  { rank: 1, name: "Fresh Tomatoes", unitsSold: 124, revenue: "N241,800" },
  { rank: 2, name: "Basmatic Rice", unitsSold: 98, revenue: "N803,600" },
  { rank: 3, name: "Fresh Spinach", unitsSold: 87, revenue: "N82,650" },
  { rank: 4, name: "Free-Range Eggs", unitsSold: 76, revenue: "N45,600" },
  { rank: 5, name: "Goat Meat", unitsSold: 54, revenue: "N162,000" },
]

export const salesByCategory: SalesCategoryRow[] = [
  { name: "Vegetables", value: "N420K", percent: 68, barColor: "#22C55E" },
  { name: "Vegetables", value: "N420K", percent: 50, barColor: "#3B82F6" },
  { name: "Vegetables", value: "N420K", percent: 45, barColor: "#F59E0B" },
  { name: "Vegetables", value: "N420K", percent: 31, barColor: "#EF4444" },
  { name: "Vegetables", value: "N420K", percent: 19, barColor: "#9CA3AF" },
]

export const dashboardSummaryCards: DashboardSummaryCard[] = [
  {
    icon: "truck",
    iconBg: "#E8F5E9",
    iconColor: "#2D5A27",
    value: "8",
    title: "Orders in transit today",
    footer: "4 active riders",
    footerClassName: "text-[#2D5A27]",
    to: dashboardLinks.delivery,
  },
  {
    icon: "tag",
    iconBg: "#FFF0E6",
    iconColor: "#E67E22",
    value: "3",
    title: "Active promo codes",
    footer: "N43,200 discount given",
    footerClassName: "text-[#2D5A27]",
    to: dashboardLinks.promoCodes,
  },
  {
    icon: "card",
    iconBg: "#E8F0FE",
    iconColor: "#3B82F6",
    value: "N1.24M",
    title: "Collected this week",
    footer: "3 pending refunds",
    footerClassName: "text-red-600",
    to: dashboardLinks.payment,
  },
]
