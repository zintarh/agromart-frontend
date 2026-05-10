import { ProductCard } from "./product-card"

const PRODUCTS = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    originalPrice: 1500,
    discountedPrice: 1200,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=300&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Spinach Bunch",
    originalPrice: 800,
    discountedPrice: 600,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Sweet Oranges",
    originalPrice: 2000,
    discountedPrice: 1500,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Brown Rice",
    originalPrice: 3500,
    discountedPrice: 3000,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Fresh Red Pepper",
    originalPrice: 1200,
    discountedPrice: 900,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Ripe Avocado",
    originalPrice: 2500,
    discountedPrice: 2000,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&h=300&fit=crop&q=80",
  },
]

export function FeaturedProducts() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Featured Products</h3>
        <button className="text-sm font-medium text-primary">See all</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
