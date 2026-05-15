import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductFeaturedStarProps = {
  featured: boolean
}

export function ProductFeaturedStar({ featured }: ProductFeaturedStarProps) {
  return (
    <Star
      className={cn(
        "size-4",
        featured ? "fill-[#E67E22] text-[#E67E22]" : "text-muted-foreground/40"
      )}
      strokeWidth={featured ? 0 : 1.75}
    />
  )
}
