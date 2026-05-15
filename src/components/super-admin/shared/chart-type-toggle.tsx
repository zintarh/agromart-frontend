"use client"

import { cn } from "@/lib/utils"

export type ChartType = "line" | "bar"

type ChartTypeToggleProps = {
  value: ChartType
  onChange: (value: ChartType) => void
}

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-0.5">
      {(["line", "bar"] as const).map((type) => {
        const isActive = value === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "h-8 min-w-[52px] px-3 text-xs font-medium capitalize transition-colors",
              isActive
                ? "rounded-md bg-[#2D5A27] text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {type}
          </button>
        )
      })}
    </div>
  )
}
