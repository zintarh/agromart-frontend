import { X } from "lucide-react"

type UploadProgressItemProps = {
  fileName: string
  uploadedSize: string
  totalSize: string
  progress: number
  previewUrl?: string
  onCancel?: () => void
}

export function UploadProgressItem({
  fileName,
  uploadedSize,
  totalSize,
  progress,
  previewUrl,
  onCancel,
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
          <p className="shrink-0 text-xs font-medium text-foreground">{progress}%</p>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {uploadedSize} / {totalSize}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#2D5A27] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        aria-label={`Cancel upload for ${fileName}`}
      >
        <X className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}
