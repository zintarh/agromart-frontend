import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type IconActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

export function IconActionButton({
  icon: Icon,
  label,
  onClick,
  className,
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-lg border border-[#E8E8E8] bg-[#F5F5F5] text-foreground transition-colors hover:bg-[#EBEBEB]",
        className
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </button>
  )
}
