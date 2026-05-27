import { cn } from "@/lib/utils"

type CustomerAvatarProps = {
  initials: string
  color: string
  textColor?: string
}

export function CustomerAvatar({ initials, color, textColor }: CustomerAvatarProps) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        textColor ?? "text-[#1a1a1a]"
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}
