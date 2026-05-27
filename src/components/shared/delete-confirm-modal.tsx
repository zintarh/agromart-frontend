"use client"

import { ActionConfirmModal } from "@/components/shared/action-confirm-modal"

export type DeleteConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  detail?: React.ReactNode
  confirmLabel?: string
  confirmingLabel?: string
  onConfirm: () => void | Promise<void>
  isConfirming?: boolean
}

/** Delete / destructive confirmation using the shared error-delete illustration. */
export function DeleteConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  detail,
  confirmLabel = "Delete",
  confirmingLabel = "Deleting…",
  onConfirm,
  isConfirming = false,
}: DeleteConfirmModalProps) {
  return (
    <ActionConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      title={title}
      description={description}
      detail={detail}
      cancelLabel="Cancel"
      confirmLabel={confirmLabel}
      confirmingLabel={confirmingLabel}
      onConfirm={onConfirm}
      closeOnBackdrop={false}
      isConfirming={isConfirming}
    />
  )
}
