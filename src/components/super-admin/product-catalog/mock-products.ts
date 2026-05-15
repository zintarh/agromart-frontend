export type Product = {
  id: string
  name: string
  category: string
  vendor: string
  stock: number
  price: string
  featured: boolean
}

export const productStats = {
  total: { value: "136", sublabel: "7 categories" },
  active: { value: "110", sublabel: "83% active" },
  outOfStock: {
    value: "8",
    sublabel: "Need restocking",
    sublabelClassName: "text-destructive",
  },
  lowStock: {
    value: "15",
    sublabel: "↓ Below threshold",
    sublabelClassName: "text-[#E67E22]",
  },
} as const

const productSeeds: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "Vegetable",
    vendor: "GreenField Farm",
    stock: 45,
    price: "N1,950",
    featured: true,
  },
  {
    id: "2",
    name: "Yellow Pepper",
    category: "Vegetable",
    vendor: "GreenField Farm",
    stock: 32,
    price: "N2,400",
    featured: true,
  },
  {
    id: "3",
    name: "Watermelon",
    category: "Fruit",
    vendor: "Sunrise Agro",
    stock: 18,
    price: "N3,500",
    featured: false,
  },
  {
    id: "4",
    name: "Local Rice (5kg)",
    category: "Grains",
    vendor: "Harvest Co-op",
    stock: 60,
    price: "N8,200",
    featured: true,
  },
  {
    id: "5",
    name: "Plantain Bunch",
    category: "Fruit",
    vendor: "Sunrise Agro",
    stock: 24,
    price: "N1,800",
    featured: false,
  },
  {
    id: "6",
    name: "Fresh Okra",
    category: "Vegetable",
    vendor: "GreenField Farm",
    stock: 12,
    price: "N950",
    featured: false,
  },
]

/** Enough rows for paginated tables (10 per page). */
export const products: Product[] = Array.from({ length: 100 }, (_, index) => {
  const seed = productSeeds[index % productSeeds.length]
  const page = Math.floor(index / productSeeds.length) + 1

  return {
    ...seed,
    id: String(index + 1),
    name: page === 1 ? seed.name : `${seed.name} (${page})`,
    stock: Math.max(0, seed.stock - (index % 8)),
    featured: index % 3 === 0,
  }
})
