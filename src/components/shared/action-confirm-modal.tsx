"use client"

import { ArrowLeft } from "lucide-react"

import { type ActionConfirmIconVariant } from "@/components/shared/action-confirm-icon"
import { ErrorDeleteModalIcon, SuccessModalIcon } from "@/components/shared/modal-illustration-icon"
import { CenteredModal } from "@/components/super-admin/shared/centered-modal"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const actionButtonClass =
  "h-11 min-w-[148px] gap-2 rounded-lg px-6 text-sm font-medium sm:min-w-[168px]"

export type ActionConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  /** Secondary line under the description (e.g. email, order id, zone). */
  detail?: React.ReactNode
  /** Optional block between copy and actions (preview card, metadata). */
  preview?: React.ReactNode
  variant?: ActionConfirmIconVariant
  icon?: React.ReactNode
  cancelLabel?: string
  confirmLabel?: string
  confirmingLabel?: string
  onCancel?: () => void
  onConfirm: () => void | Promise<void>
  isConfirming?: boolean
  /** Close modal after `onConfirm` resolves successfully. Default true. */
  closeOnSuccess?: boolean
  closeOnBackdrop?: boolean
}

export function ActionConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  detail,
  preview,
  variant = "danger",
  icon,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmingLabel = "Please wait…",
  onCancel,
  onConfirm,
  isConfirming = false,
  closeOnSuccess = true,
  closeOnBackdrop = false,
}: ActionConfirmModalProps) {
  const handleCancel = () => {
    if (isConfirming) return
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    if (isConfirming) return
    try {
      await onConfirm()
      if (closeOnSuccess) {
        onOpenChange(false)
      }
    } catch {
      // Caller handles errors (e.g. toast); keep modal open.
    }
  }

  const confirmButtonClass =
    variant === "danger"
      ? "bg-[#DC2626] text-white hover:bg-[#DC2626]/90"
      : "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"

  return (
    <CenteredModal
      open={open}
      onOpenChange={onOpenChange}
      closeOnBackdrop={closeOnBackdrop && !isConfirming}
      className="max-w-[min(520px,92vw)]"
      bodyClassName="px-8 py-10 md:px-12 md:py-12"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          {icon ?? (variant === "warning" ? <SuccessModalIcon /> : <ErrorDeleteModalIcon />)}
        </div>

        <h2
          id="action-confirm-title"
          className="font-heading text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl"
        >
          {title}
        </h2>

        <div className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>

        {detail ? (
          <p className="mt-2 max-w-md text-xs font-medium text-muted-foreground/90">{detail}</p>
        ) : null}

        {preview ? <div className="mt-6 w-full">{preview}</div> : null}

        <div className="mt-8 flex w-full flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isConfirming}
            onClick={handleCancel}
            className={cn(buttonVariants({ variant: "outline" }), actionButtonClass, "w-full sm:w-auto")}
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            {cancelLabel}
          </Button>

          <Button
            type="button"
            disabled={isConfirming}
            onClick={() => void handleConfirm()}
            className={cn(actionButtonClass, confirmButtonClass, "w-full sm:w-auto")}
          >
            {isConfirming ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </CenteredModal>
  )
}
