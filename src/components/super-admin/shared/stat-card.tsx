import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  sublabel: string
  sublabelClassName?: string
}

export function StatCard({
  label,
  value,
  sublabel,
  sublabelClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white px-5 py-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-foreground">{value}</p>
      <p className={cn("mt-0.5 text-xs", sublabelClassName ?? "text-muted-foreground")}>
        {sublabel}
      </p>
    </div>
  )
}
