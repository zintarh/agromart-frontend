import { Clock, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

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
  category,
  name,
  price,
  imageUrl,
  statusLabel,
  timestampLabel,
  variant = "published",
}: ProductPreviewCardProps) {
  const isDraft = variant === "draft"
  const displayName = name?.trim() || "Product"
  const displayCategory = category?.trim() || "—"
  const displayPrice = price?.trim() || "—"
  const displayStatus = statusLabel?.trim() || (isDraft ? "Status: Draft" : "Status: Active")
  const displayTimestamp = timestampLabel?.trim() || "Just now"
  const visibilityLabel = isDraft ? "Not visible publicly" : "Visible to All"

  return (
    <div className="flex w-full overflow-hidden rounded-xl border border-border bg-white text-left">
      <div className="relative w-1/2 min-h-[148px] shrink-0 overflow-hidden rounded-l-xl bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex w-1/2 flex-col justify-center gap-3 px-5 py-5 md:px-6 md:py-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {displayCategory}
          </span>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 text-xs font-medium",
              isDraft ? "text-[#9A3412]" : "text-[#2D5A27]"
            )}
          >
            {isDraft ? (
              <EyeOff className="size-3.5" strokeWidth={2} />
            ) : (
              <Eye className="size-3.5" strokeWidth={2} />
            )}
            {visibilityLabel}
          </span>
        </div>

        <div className="space-y-0.5">
          <p
            className={cn(
              "text-base font-bold leading-tight",
              isDraft ? "text-[#2D5A27]" : "text-foreground"
            )}
          >
            {displayName}
          </p>
          <p
            className={cn(
              "text-lg font-bold leading-tight",
              isDraft ? "text-[#2D5A27]" : "text-foreground"
            )}
          >
            {displayPrice}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-[#4ADE80]" />
            {displayStatus}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
            {displayTimestamp}
          </span>
        </div>
      </div>
    </div>
  )
}
