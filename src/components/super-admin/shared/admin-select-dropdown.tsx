"use client"

import { ChevronDown, ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type SelectOption = {
  value: string
  label: string
}

type AdminSelectDropdownProps = {
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  align?: "start" | "center" | "end"
  triggerIcon?: "chevron" | "chevrons"
}

export function AdminSelectDropdown({
  value,
  options,
  onValueChange,
  placeholder,
  className,
  align = "start",
  triggerIcon = "chevron",
}: AdminSelectDropdownProps) {
  const TriggerIcon = triggerIcon === "chevrons" ? ChevronsUpDown : ChevronDown
  const selected = options.find((option) => option.value === value)
  const displayLabel = selected?.label ?? placeholder ?? "Select"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <span className={cn("truncate", !selected && placeholder && "text-muted-foreground")}>
          {displayLabel}
        </span>
        <TriggerIcon className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-(--anchor-width)">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={cn(
              option.value === value && "bg-muted font-medium"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
