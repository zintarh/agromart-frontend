"use client"

import {
  AdminSelectDropdown,
  type SelectOption,
} from "@/components/super-admin/shared/admin-select-dropdown"

type FilterDropdownProps = {
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  className?: string
}

export function FilterDropdown({
  value,
  options,
  onValueChange,
  className,
}: FilterDropdownProps) {
  return (
    <AdminSelectDropdown
      value={value}
      options={options}
      onValueChange={onValueChange}
      className={className ?? "w-auto min-w-[140px]"}
    />
  )
}
