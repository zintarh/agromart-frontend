import { cn } from "@/lib/utils"

type CustomerStatCardProps = {
  label: string
  value: string
  sublabel: string
  sublabelClassName?: string
}

export function CustomerStatCard({
  label,
  value,
  sublabel,
  sublabelClassName,
}: CustomerStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#E8E8E8] bg-white px-6 py-5">
      <p className="text-sm text-[#9CA3AF]">{label}</p>
      <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-[#111827]">
        {value}
      </p>
      <p
        className={cn(
          "mt-2 text-xs leading-none",
          sublabelClassName ?? "text-[#9CA3AF]"
        )}
      >
        {sublabel}
      </p>
    </div>
  )
}
