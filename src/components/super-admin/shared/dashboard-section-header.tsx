import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

type DashboardSectionHeaderProps = {
  title: string
  linkLabel?: string
  linkTo?: string
  trailing?: React.ReactNode
  className?: string
}

export function DashboardSectionHeader({
  title,
  linkLabel,
  linkTo,
  trailing,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        {trailing}
        {linkLabel && linkTo && (
          <Link
            to={linkTo}
            className="shrink-0 text-sm font-semibold text-[#2D5A27] hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
