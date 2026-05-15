import { cn } from "@/lib/utils"

type DashboardCardProps = {
  children: React.ReactNode
  className?: string
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[#E8E8E8] bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </section>
  )
}
