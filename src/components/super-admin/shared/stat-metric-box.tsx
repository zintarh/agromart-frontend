import { cn } from "@/lib/utils"

type StatMetricBoxProps = {
  value: React.ReactNode
  label: string
  variant: "mint" | "peach" | "yellow"
  className?: string
}

const variantStyles = {
  mint: "bg-[#E8F5E9]",
  peach: "bg-[#FFF0E6]",
  yellow: "bg-[#FFF9E6]",
}

export function StatMetricBox({ value, label, variant, className }: StatMetricBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center rounded-xl px-4 py-5",
        variantStyles[variant],
        className
      )}
    >
      <p className="font-heading text-2xl font-bold leading-none text-foreground">{value}</p>
      <p className="mt-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}
