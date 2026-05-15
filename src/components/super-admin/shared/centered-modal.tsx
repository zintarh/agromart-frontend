import {
  CENTERED_MODAL_BODY_CLASS,
  MODAL_BACKDROP_CLASS,
  MODAL_OVERLAY_CLASS,
  MODAL_PANEL_CLASS,
} from "@/components/super-admin/shared/modal-panel-styles"
import { cn } from "@/lib/utils"

type CenteredModalProps = {
  open: boolean
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  closeOnBackdrop?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CenteredModal({
  open,
  children,
  className,
  bodyClassName,
  closeOnBackdrop = false,
  onOpenChange,
}: CenteredModalProps) {
  if (!open) return null

  return (
    <div className={MODAL_OVERLAY_CLASS} role="presentation">
      {closeOnBackdrop && onOpenChange ? (
        <button
          type="button"
          className={MODAL_BACKDROP_CLASS}
          aria-label="Close modal"
          onClick={() => onOpenChange(false)}
        />
      ) : (
        <div className={MODAL_BACKDROP_CLASS} aria-hidden />
      )}

      <div
        role="dialog"
        aria-modal="true"
        className={cn(MODAL_PANEL_CLASS, className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cn(CENTERED_MODAL_BODY_CLASS, bodyClassName)}>{children}</div>
      </div>
    </div>
  )
}
