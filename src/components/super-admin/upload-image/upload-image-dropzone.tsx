import { useRef } from "react"
import { CloudUpload } from "lucide-react"

import { Button } from "@/components/ui/button"

type UploadImageDropzoneProps = {
  onFilesSelected?: (files: FileList) => void
}

export function UploadImageDropzone({ onFilesSelected }: UploadImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-white px-6 py-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#E8F5E9]">
          <CloudUpload className="size-6 text-[#2D5A27]" strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Drag and drop your images here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF up to 5MB</p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 h-9 border-border bg-white px-4 text-sm font-medium text-foreground"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          className="sr-only"
          onChange={(event) => {
            const files = event.target.files
            if (files?.length) onFilesSelected?.(files)
          }}
        />
      </div>
    </div>
  )
}
