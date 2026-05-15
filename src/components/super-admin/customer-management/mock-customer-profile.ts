import type { Customer, CustomerStatus } from "@/components/super-admin/customer-management/mock-customers"
import { customers } from "@/components/super-admin/customer-management/mock-customers"

export type OrderHistoryStatus = "delivered" | "cancelled"

export type CustomerOrderHistory = {
  orderId: string
  date: string
  items: number
  total: string
  status: OrderHistoryStatus
}

export type CustomerSavedAddress = {
  label: string
  address: string
}

export type CustomerProfile = Customer & {
  lastLogin: string
  joinedDisplay: string
  rating: number
  totalSpentShort: string
  summaryInitials: string
  summaryAvatarColor: string
  orderHistory: CustomerOrderHistory[]
  addresses: CustomerSavedAddress[]
}

const defaultOrderHistory: CustomerOrderHistory[] = [
  {
    orderId: "#7891",
    date: "Apr 13",
    items: 3,
    total: "₦12,950",
    status: "delivered",
  },
  {
    orderId: "#7870",
    date: "Apr 5",
    items: 2,
    total: "₦8,400",
    status: "delivered",
  },
  {
    orderId: "#7830",
    date: "Mar 20",
    items: 1,
    total: "₦7,500",
    status: "cancelled",
  },
]

const defaultAddresses: CustomerSavedAddress[] = [
  { label: "HOME", address: "12 Gidan Murtala, Sabon Gari, Kano" },
  { label: "WORK", address: "45 Unity Rd, GRA, Kano" },
]

function buildProfile(customer: Customer): CustomerProfile {
  const isPrimarySeed = customer.id === "1"

  return {
    ...customer,
    lastLogin: isPrimarySeed ? "Apr 13, 2026" : customer.joined,
    joinedDisplay: isPrimarySeed ? "January 2024" : customer.joined,
    rating: isPrimarySeed ? 4.8 : 4.2 + (Number(customer.id) % 8) * 0.1,
    totalSpentShort: isPrimarySeed ? "₦145k" : customer.totalSpent.replace("N", "₦"),
    summaryInitials: isPrimarySeed ? "AI" : customer.initials,
    summaryAvatarColor: isPrimarySeed ? "#2D5A27" : customer.avatarColor,
    orderHistory: defaultOrderHistory,
    addresses: defaultAddresses,
  }
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id)
}

export function getCustomerProfile(id: string): CustomerProfile | undefined {
  const customer = getCustomerById(id)
  if (!customer) return undefined
  return buildProfile(customer)
}

export function getCustomerProfileOrThrow(id: string): CustomerProfile {
  const profile = getCustomerProfile(id)
  if (!profile) {
    throw new Error(`Customer not found: ${id}`)
  }
  return profile
}

export type { CustomerStatus }
