import { X } from "lucide-react"

import {
  ADMIN_MODAL_PANEL_CLASS,
  MODAL_BACKDROP_CLASS,
  MODAL_OVERLAY_CLASS,
} from "@/components/super-admin/shared/modal-panel-styles"
import { cn } from "@/lib/utils"

type AdminModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
  bodyClassName?: string
  footerClassName?: string
  showCloseButton?: boolean
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
  headerClassName,
  titleClassName,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
}: AdminModalProps) {
  if (!open) return null

  return (
    <div className={MODAL_OVERLAY_CLASS} role="presentation">
      <button
        type="button"
        className={MODAL_BACKDROP_CLASS}
        aria-label="Close modal"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={cn(ADMIN_MODAL_PANEL_CLASS, "max-w-[min(854px,90vw)]", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={cn(
            "border-b border-[#E5E7EB] px-8 py-5",
            showCloseButton && "flex items-center justify-between",
            headerClassName
          )}
        >
          <h2
            id="admin-modal-title"
            className={cn("text-base font-semibold text-foreground", titleClassName)}
          >
            {title}
          </h2>
          {showCloseButton ? (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>

        <div className={cn("px-8 py-6", bodyClassName)}>{children}</div>

        {footer && (
          <div
            className={cn(
              "flex justify-end gap-3 border-t border-border px-8 py-5",
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
