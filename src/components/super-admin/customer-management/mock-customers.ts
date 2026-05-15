export type CustomerStatus = "active" | "suspended"

export type Customer = {
  id: string
  name: string
  initials: string
  avatarColor: string
  email: string
  phone: string
  joined: string
  /** ISO date from API — used for client-side date filters. */
  createdAt?: string
  role?: string
  emailVerified?: boolean
  orders: number
  status: CustomerStatus
  totalSpent: string
}

export const customerStats = {
  total: { value: "156", sublabel: "7 categories" },
  active: { value: "142", sublabel: "90% active" },
  suspended: {
    value: "14",
    sublabel: "3 new suspension",
    sublabelClassName: "text-destructive",
  },
  avgOrders: {
    value: "3.2",
    sublabel: "↓ 0.4 vs last month",
    sublabelClassName: "text-[#2D5A27]",
  },
} as const

const customerSeeds: Customer[] = [
  {
    id: "1",
    name: "Aminu Ibrahim",
    initials: "AM",
    avatarColor: "#E8F5E9",
    email: "aminu@gmail.com",
    phone: "08012345678",
    joined: "Jan 20, 2024",
    orders: 12,
    status: "active",
    totalSpent: "N1,950",
  },
  {
    id: "2",
    name: "John Smith",
    initials: "JS",
    avatarColor: "#E3F2FD",
    email: "john.smith@gmail.com",
    phone: "08029876543",
    joined: "Feb 14, 2024",
    orders: 8,
    status: "active",
    totalSpent: "N1,240",
  },
  {
    id: "3",
    name: "Blessing Bello",
    initials: "BB",
    avatarColor: "#FFF3E0",
    email: "blessing.b@gmail.com",
    phone: "07051234567",
    joined: "Mar 5, 2024",
    orders: 5,
    status: "suspended",
    totalSpent: "N890",
  },
  {
    id: "4",
    name: "Chioma Okafor",
    initials: "CO",
    avatarColor: "#F3E5F5",
    email: "chioma.o@gmail.com",
    phone: "08123456789",
    joined: "Apr 12, 2024",
    orders: 15,
    status: "active",
    totalSpent: "N2,450",
  },
  {
    id: "5",
    name: "Emeka Nwosu",
    initials: "EN",
    avatarColor: "#E8EAF6",
    email: "emeka.n@gmail.com",
    phone: "09087654321",
    joined: "May 3, 2024",
    orders: 3,
    status: "suspended",
    totalSpent: "N520",
  },
  {
    id: "6",
    name: "Fatima Yusuf",
    initials: "FY",
    avatarColor: "#FCE4EC",
    email: "fatima.y@gmail.com",
    phone: "08098765432",
    joined: "Jun 18, 2024",
    orders: 9,
    status: "active",
    totalSpent: "N1,680",
  },
]

/** Enough rows for paginated tables (10 per page). */
export const customers: Customer[] = Array.from({ length: 100 }, (_, index) => {
  const seed = customerSeeds[index % customerSeeds.length]
  const page = Math.floor(index / customerSeeds.length) + 1

  return {
    ...seed,
    id: String(index + 1),
    name: page === 1 ? seed.name : `${seed.name} ${page}`,
    email:
      page === 1
        ? seed.email
        : seed.email.replace("@", `+${index}@`),
    phone: seed.phone.slice(0, -2) + String(index).padStart(2, "0").slice(-2),
    orders: seed.orders + (index % 4),
    totalSpent: seed.totalSpent,
  }
})
