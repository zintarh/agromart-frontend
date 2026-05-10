import { Plus } from "lucide-react"

interface ProductCardProps {
  name: string
  originalPrice: number
  discountedPrice: number
  unit: string
  image: string
}

export function ProductCard({ name, originalPrice, discountedPrice, unit, image }: ProductCardProps) {
  return (
    <div className="bg-background shadow-sm">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-36 w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-full border border-white/40 bg-white/60 px-3 py-1 text-xs font-medium text-emerald-600 backdrop-blur-sm">
          In stock
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-base font-bold text-foreground">{name}</p>
        <div className="mt-1.5 flex items-end justify-between">
          <div>
            <p className="text-xs text-foreground/40 line-through">
              ₦{originalPrice.toLocaleString()}/{unit}
            </p>
            <p className="text-base font-bold text-primary">
              ₦{discountedPrice.toLocaleString()}/{unit}
            </p>
          </div>
          <button className="flex size-10 items-center justify-center rounded-xl bg-[#2b5219] text-white">
            <Plus className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
