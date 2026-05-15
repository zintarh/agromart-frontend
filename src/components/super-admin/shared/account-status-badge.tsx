import { cn } from "@/lib/utils"

type AccountStatusBadgeProps = {
  label: string
  className?: string
}

export function AccountStatusBadge({ label, className }: AccountStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-[#E8F5E9] px-3 py-1 text-[10px] font-semibold tracking-wide text-[#2D5A27] uppercase",
        className
      )}
    >
      {label}
    </span>
  )
}
