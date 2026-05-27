import { cn } from "@/lib/utils"

type VendorKpiCardProps = {
  label: string
  value: string
  trend?: string
  trendClassName?: string
  sublabel?: string
}

export function VendorKpiCard({
  label,
  value,
  trend,
  trendClassName,
  sublabel,
}: VendorKpiCardProps) {
  return (
    <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
      <p className="text-sm text-[#9CA3AF]">{label}</p>
      <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-[#111827]">
        {value}
      </p>
      {trend ? (
        <p className={cn("mt-2 text-xs font-medium text-[#2D5A27]", trendClassName)}>{trend}</p>
      ) : null}
      {sublabel ? (
        <p className={cn("text-xs text-[#9CA3AF]", trend ? "mt-1" : "mt-2")}>{sublabel}</p>
      ) : null}
    </div>
  )
}
