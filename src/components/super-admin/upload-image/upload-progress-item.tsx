import { CheckCircle2, X, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type UploadProgressItemProps = {
  fileName: string
  uploadedSize: string
  totalSize: string
  progress: number
  status: "uploading" | "done" | "error"
  previewUrl?: string
  errorMessage?: string
  onCancel?: () => void
  isCancelling?: boolean
}

export function UploadProgressItem({
  fileName,
  uploadedSize,
  totalSize,
  progress,
  status,
  previewUrl,
  errorMessage,
  onCancel,
  isCancelling = false,
}: UploadProgressItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-10 shrink-0 overflow-hidden rounded-md border border-border bg-[#E8F5E9]"
        aria-hidden
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-gradient-to-br from-[#86EFAC] to-[#22C55E]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
          {status === "done" ? (
            <CheckCircle2 className="size-4 shrink-0 text-[#2D5A27]" />
          ) : status === "error" ? (
            <AlertCircle className="size-4 shrink-0 text-destructive" />
          ) : (
            <p className="shrink-0 text-xs font-medium text-foreground">{progress}%</p>
          )}
        </div>
        {status === "error" ? (
          <p className="mt-0.5 text-xs text-destructive">{errorMessage ?? "Upload failed"}</p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {status === "done" ? totalSize : `${uploadedSize} / ${totalSize}`}
          </p>
        )}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              status === "error" ? "bg-destructive" : "bg-[#2D5A27]"
            )}
            style={{ width: `${status === "error" ? 100 : progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onCancel}
        disabled={isCancelling}
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-wait disabled:opacity-50"
        aria-label={`Remove ${fileName}`}
      >
        {isCancelling ? (
          <span className="size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : (
          <X className="size-3.5" strokeWidth={2} />
        )}
      </button>
    </div>
  )
}
