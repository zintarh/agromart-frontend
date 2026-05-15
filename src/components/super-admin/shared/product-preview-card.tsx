import { Clock, Eye } from "lucide-react"

import { cn } from "@/lib/utils"

const CARROT_IMAGE =
  "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=480&h=360&fit=crop"

export type ProductPreviewCardVariant = "published" | "draft"

type ProductPreviewCardProps = {
  category?: string
  name?: string
  price?: string
  imageUrl?: string
  statusLabel?: string
  timestampLabel?: string
  variant?: ProductPreviewCardVariant
}

export function ProductPreviewCard({
  category = "Supplements",
  name = "Fresh Carrot",
  price = "N1,200 / kg",
  imageUrl = CARROT_IMAGE,
  statusLabel = "Status: In Stock",
  timestampLabel = "Published just now",
  variant = "published",
}: ProductPreviewCardProps) {
  const isDraft = variant === "draft"

  return (
    <div className="flex w-full overflow-hidden rounded-xl border border-border bg-white text-left">
      <div className="relative w-1/2 min-h-[148px] shrink-0 overflow-hidden rounded-l-xl">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <div className="flex w-1/2 flex-col justify-center gap-3 px-5 py-5 md:px-6 md:py-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {category}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#2D5A27]">
            <Eye className="size-3.5" strokeWidth={2} />
            Visible to All
          </span>
        </div>

        <div className="space-y-0.5">
          <p
            className={cn(
              "text-base font-bold leading-tight",
              isDraft ? "text-[#2D5A27]" : "text-foreground"
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              "text-lg font-bold leading-tight",
              isDraft ? "text-[#2D5A27]" : "text-foreground"
            )}
          >
            {price}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-[#4ADE80]" />
            {statusLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
            {timestampLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
