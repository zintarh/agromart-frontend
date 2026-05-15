import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

type KpiStatCardProps = {
  label: string
  value: string
  trend?: string
  trendClassName?: string
  sublabel?: string
  sublabelClassName?: string
  to?: string
}

export function KpiStatCard({
  label,
  value,
  trend,
  trendClassName,
  sublabel,
  sublabelClassName,
  to,
}: KpiStatCardProps) {
  const content = (
    <>
      <p className="font-label text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-[26px] font-bold leading-none tracking-tight text-foreground">
        {value}
      </p>
      {trend && (
        <p className={cn("mt-2 font-label text-xs font-medium text-[#2D5A27]", trendClassName)}>
          {trend}
        </p>
      )}
      {sublabel && (
        <p
          className={cn(
            "mt-2 font-label text-xs",
            trend ? "mt-1" : "",
            sublabelClassName ?? "text-muted-foreground"
          )}
        >
          {sublabel}
        </p>
      )}
    </>
  )

  const className =
    "block rounded-xl border border-[#E8E8E8] bg-white p-5 shadow-sm transition-colors hover:border-[#D4D4D4]"

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
