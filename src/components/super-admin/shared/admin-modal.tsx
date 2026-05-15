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
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
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
        className={cn(ADMIN_MODAL_PANEL_CLASS, "max-w-[min(640px,85vw)]", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <h2 id="admin-modal-title" className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-8 py-6">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-border px-8 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
