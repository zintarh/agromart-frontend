"use client"

import { useRef } from "react"
import { Camera, User } from "lucide-react"

import { cn } from "@/lib/utils"

type ProfilePhotoUploadProps = {
  className?: string
}

export function ProfilePhotoUpload({ className }: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <div className="flex size-[120px] items-center justify-center rounded-full bg-[#F0F0F0]">
          <User className="size-12 text-[#BDBDBD]" strokeWidth={1.5} />
        </div>
        <span className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full bg-[#2D5A27] ring-2 ring-white">
          <Camera className="size-4 text-white" strokeWidth={2} />
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-foreground">Profile Picture</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        JPG, PNG or GIF. Max size 2MB.
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-2 text-sm font-medium text-[#2D5A27] hover:underline"
      >
        Upload photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="sr-only"
        aria-hidden
      />
    </div>
  )
}
