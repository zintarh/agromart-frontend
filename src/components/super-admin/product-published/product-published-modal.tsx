"use client"

import { Link } from "@tanstack/react-router"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { SuccessBadgeIcon } from "@/components/super-admin/product-published/success-badge-icon"
import { ProductPreviewCard } from "@/components/super-admin/shared/product-preview-card"
import { SuccessModalLayout } from "@/components/super-admin/shared/success-modal-layout"
import { buttonVariants } from "@/components/ui/button"
import { formatProductPreviewPrice } from "@/lib/product-preview-format"
import { cn } from "@/lib/utils"

export type PublishedProductSnapshot = {
  name: string
  categoryName: string
  unit: string
  compareAtPrice?: string
  imageUrl?: string
}

type ProductPublishedModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: PublishedProductSnapshot | null
}

const actionButtonClass =
  "h-11 min-w-[168px] gap-2 rounded-lg px-6 text-sm font-medium"

export function ProductPublishedModal({
  open,
  onOpenChange,
  product,
}: ProductPublishedModalProps) {
  return (
    <SuccessModalLayout
      open={open}
      icon={<SuccessBadgeIcon />}
      title="Product Published Successfully!"
      subtitle="Your product is now live on the marketplace and visible to customers."
      preview={
        <ProductPreviewCard
          variant="published"
          name={product?.name}
          category={product?.categoryName}
          imageUrl={product?.imageUrl}
          price={
            product ? formatProductPreviewPrice(product.compareAtPrice, product.unit) : undefined
          }
          statusLabel="Status: Active"
          timestampLabel="Published just now"
        />
      }
      actions={
        <>
          <Link
            to="/admin/products"
            onClick={() => onOpenChange(false)}
            className={cn(
              buttonVariants(),
              actionButtonClass,
              "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
            )}
          >
            <ExternalLink className="size-4" strokeWidth={2} />
            View Product
          </Link>

          <Link
            to="/admin/products"
            onClick={() => onOpenChange(false)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              actionButtonClass,
              "border-border bg-white text-foreground"
            )}
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            Back to Catalog
          </Link>
        </>
      }
    />
  )
}
