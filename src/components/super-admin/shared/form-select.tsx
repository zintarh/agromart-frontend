"use client"

import { useState } from "react"

import {
  AdminSelectDropdown,
  type SelectOption,
} from "@/components/super-admin/shared/admin-select-dropdown"
import { cn } from "@/lib/utils"

type FormSelectProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  options?: SelectOption[]
  className?: string
  onValueChange?: (value: string) => void
  triggerIcon?: "chevron" | "chevrons"
}

export function FormSelect({
  value,
  defaultValue = "",
  placeholder,
  options = [],
  className,
  onValueChange,
  triggerIcon,
}: FormSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue

  const handleValueChange = (next: string) => {
    setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <AdminSelectDropdown
      value={currentValue}
      options={options}
      onValueChange={handleValueChange}
      placeholder={placeholder}
      triggerIcon={triggerIcon}
      className={cn(className)}
    />
  )
}
