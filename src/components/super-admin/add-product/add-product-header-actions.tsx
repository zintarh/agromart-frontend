import { Link } from "@tanstack/react-router"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AddProductHeaderActionsProps = {
  onPublish?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

export function AddProductHeaderActions({
  onPublish,
  submitLabel = "Publish Product",
  isSubmitting = false,
}: AddProductHeaderActionsProps) {
  return (
    <>
      <Link
        to="/admin/products"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-10 border-border bg-[#E8E8E8] px-4 text-sm font-medium text-foreground hover:bg-[#E8E8E8]/80"
        )}
      >
        Cancel
      </Link>
      <button
        type="button"
        onClick={onPublish}
        disabled={isSubmitting}
        className={cn(
          buttonVariants(),
          "h-10 rounded-lg bg-[#2D5A27] px-4 text-sm font-medium text-white hover:bg-[#2D5A27]/90 disabled:opacity-60"
        )}
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </>
  )
}
