"use client"

import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal"
import type { CatalogProduct } from "@/lib/product-catalog-types"

type DeleteProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: CatalogProduct | null
  isDeleting?: boolean
  onConfirm: () => Promise<void>
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  isDeleting = false,
  onConfirm,
}: DeleteProductDialogProps) {
  const name = product?.name ?? "this product"

  return (
    <DeleteConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete product?"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">{name}</span>? This action cannot be
          undone.
        </>
      }
      isConfirming={isDeleting}
      onConfirm={onConfirm}
    />
  )
}
