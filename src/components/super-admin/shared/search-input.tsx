"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  inputClassName?: string
}

export function SearchInput({
  placeholder,
  value = "",
  onChange,
  inputClassName,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onChange?.(draft)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [draft, onChange])

  return (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className={cn(
          "h-10 border-border bg-white pl-9 shadow-none",
          inputClassName
        )}
      />
    </div>
  )
}
