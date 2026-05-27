"use client"

import { Link } from "@tanstack/react-router"
import { LayoutGrid, Pencil } from "lucide-react"

import { DraftInfoBanner } from "@/components/super-admin/product-draft/draft-info-banner"
import { DraftSavedBadgeIcon } from "@/components/super-admin/product-draft/draft-saved-badge-icon"
import { ProductPreviewCard } from "@/components/super-admin/shared/product-preview-card"
import { SuccessModalLayout } from "@/components/super-admin/shared/success-modal-layout"
import { buttonVariants } from "@/components/ui/button"
import type { DraftProductSnapshot } from "@/lib/add-product-draft-snapshot"
import { formatProductPreviewPrice } from "@/lib/product-preview-format"
import { cn } from "@/lib/utils"

type ProductDraftSavedModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: DraftProductSnapshot | null
}

const actionButtonClass =
  "h-11 min-w-[168px] gap-2 rounded-lg px-6 text-sm font-medium"

export function ProductDraftSavedModal({
  open,
  onOpenChange,
  product,
}: ProductDraftSavedModalProps) {
  return (
    <SuccessModalLayout
      open={open}
      icon={<DraftSavedBadgeIcon />}
      title="Product Saved to Drafts"
      titleClassName="font-heading text-2xl font-bold leading-tight tracking-tight text-[#2D5A27]"
      subtitle="Your product has been saved as a draft. You can continue editing or publish it later."
      preview={
        <ProductPreviewCard
          variant="draft"
          name={product?.name}
          category={product?.categoryName}
          imageUrl={product?.imageUrl}
          price={
            product
              ? formatProductPreviewPrice(product.compareAtPrice, product.unit)
              : undefined
          }
          statusLabel="Status: Draft"
          timestampLabel="Saved just now"
        />
      }
      actions={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              buttonVariants(),
              actionButtonClass,
              "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
            )}
          >
            <Pencil className="size-4" strokeWidth={2} />
            Continue Editing
          </button>

          <Link
            to="/admin/products"
            onClick={() => onOpenChange(false)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              actionButtonClass,
              "border-border bg-white text-foreground"
            )}
          >
            <LayoutGrid className="size-4" strokeWidth={2} />
            View All Drafts
          </Link>
        </>
      }
      footer={<DraftInfoBanner />}
    />
  )
}
