"use client"

import { useState } from "react"

import { ActionConfirmModal } from "@/components/shared/action-confirm-modal"
import type { CatalogProduct } from "@/lib/product-catalog-types"

type RejectProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: CatalogProduct | null
  isRejecting?: boolean
  onConfirm: (reason: string) => Promise<void>
}

export function RejectProductDialog({
  open,
  onOpenChange,
  product,
  isRejecting = false,
  onConfirm,
}: RejectProductDialogProps) {
  const [reason, setReason] = useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setReason("")
    onOpenChange(nextOpen)
  }

  return (
    <ActionConfirmModal
      open={open}
      onOpenChange={handleOpenChange}
      variant="danger"
      title="Reject product?"
      description={
        <>
          Are you sure you want to reject{" "}
          <span className="font-semibold text-foreground">
            {product?.name ?? "this product"}
          </span>
          ? The submitter will need to resubmit for approval.
        </>
      }
      preview={
        <div className="text-left">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Rejection reason{" "}
            <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isRejecting}
            placeholder="e.g. Images are too low quality. Please resubmit with clearer photos."
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
      }
      confirmLabel="Reject"
      confirmingLabel="Rejecting…"
      isConfirming={isRejecting}
      closeOnSuccess={false}
      onConfirm={() => onConfirm(reason.trim())}
    />
  )
}
