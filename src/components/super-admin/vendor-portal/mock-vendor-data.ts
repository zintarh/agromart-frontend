export const vendorPortalSubtitle = "Transaction & financial activity"

export type ActiveVendorCard = {
  id: string
  initials: string
  name: string
  location: string
  avatarClassName: string
  products: number
  orders: number
  revenue: string
}

export type PendingVendorRow = {
  id: string
  name: string
  amount: string
  orders: number
}

export const vendorSummaryStats = [
  {
    label: "Active Vendors",
    value: "18",
    trend: "↓ 3 this week",
    trendClassName: "text-[#2D5A27]",
  },
  {
    label: "Pending Application",
    value: "3",
    sublabel: "Awaiting review",
  },
  {
    label: "Total Product",
    value: "84",
    sublabel: "4 categories",
  },
  {
    label: "Rejected",
    value: "3",
    sublabel: "This month",
  },
] as const

export const activeVendorCards: ActiveVendorCard[] = [
  {
    id: "greenfield",
    initials: "GF",
    name: "GreenField Farm",
    location: "Kaduna",
    avatarClassName: "bg-[#B8C4BC] text-[#2D3B34]",
    products: 8,
    orders: 45,
    revenue: "N112k",
  },
  {
    id: "grainmill",
    initials: "GM",
    name: "GrainMill Ltd",
    location: "Kano",
    avatarClassName: "bg-[#C9B8A8] text-[#4A3F35]",
    products: 8,
    orders: 45,
    revenue: "N112k",
  },
  {
    id: "tropicfarm",
    initials: "TP",
    name: "TropicFarm",
    location: "Abuja",
    avatarClassName: "bg-[#B5A8C4] text-[#3D3547]",
    products: 8,
    orders: 45,
    revenue: "N112k",
  },
  {
    id: "terrafresh",
    initials: "TF",
    name: "TerraFresh",
    location: "Lagos",
    avatarClassName: "bg-[#C4C4C4] text-[#3D3D3D]",
    products: 8,
    orders: 45,
    revenue: "N112k",
  },
]

export const pendingVendorRows: PendingVendorRow[] = [
  { id: "p1", name: "GreenField Farm", amount: "N112,00", orders: 45 },
  { id: "p2", name: "GrainMill Ltd", amount: "N340,00", orders: 78 },
  { id: "p3", name: "TropicFarm", amount: "N187,00", orders: 45 },
  { id: "p4", name: "TerraFresh", amount: "N187,00", orders: 45 },
]

export const pendingVendorCount = 4
