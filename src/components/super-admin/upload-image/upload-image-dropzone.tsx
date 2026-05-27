import { useCallback, useRef, useState } from "react"
import { CloudUpload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UploadImageDropzoneProps = {
  onFilesSelected?: (files: FileList) => void
  disabled?: boolean
  hint?: string
}

export function UploadImageDropzone({
  onFilesSelected,
  disabled = false,
  hint,
}: UploadImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const files = e.dataTransfer.files
      if (files?.length) onFilesSelected?.(files)
    },
    [disabled, onFilesSelected]
  )

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed border-border bg-white px-6 py-8 transition-colors",
        isDragging && !disabled && "border-[#2D5A27] bg-[#E8F5E9]/40",
        disabled && "cursor-not-allowed opacity-50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#E8F5E9]">
          <CloudUpload className="size-6 text-[#2D5A27]" strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Drag and drop your images here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP up to 10 MB</p>
        {hint && (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="mt-5 h-9 border-border bg-white px-4 text-sm font-medium text-foreground"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            const files = e.target.files
            if (files?.length) onFilesSelected?.(files)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
