"use client"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { Button } from "@/components/ui/button"
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
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      // Toast handled in parent
    }
  }

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Category"
      className="max-w-md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-foreground">{category?.name ?? "this category"}</span>
        ? Categories linked to products cannot be deleted.
      </p>
    </AdminModal>
  )
}
