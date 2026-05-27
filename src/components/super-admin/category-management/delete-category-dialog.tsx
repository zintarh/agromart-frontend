"use client"

import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal"
import type { CategoryRow } from "@/lib/categories-table-api"

type DeleteCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryRow | null
  isDeleting?: boolean
  onConfirm: () => Promise<void>
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  isDeleting = false,
  onConfirm,
}: DeleteCategoryDialogProps) {
  const name = category?.name ?? "this category"

  return (
    <DeleteConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete category?"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">{name}</span>? Categories linked to
          products cannot be deleted.
        </>
      }
      isConfirming={isDeleting}
      onConfirm={onConfirm}
    />
  )
}
