import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarNavItemProps = {
  label: string
  icon: LucideIcon
  to: string
  isActive?: boolean
}

export function SidebarNavItem({
  label,
  icon: Icon,
  to,
  isActive = false,
}: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#2D5A27] text-white"
          : "text-foreground hover:bg-muted/80"
      )}
    >
      <Icon
        className={cn("size-[18px] shrink-0", isActive ? "text-white" : "text-muted-foreground")}
        strokeWidth={1.75}
      />
      <span className="flex-1">{label}</span>
    </Link>
  )
}
