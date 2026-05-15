import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FormSectionCardProps = {
  icon?: LucideIcon
  title: string
  children: React.ReactNode
  className?: string
}

export function FormSectionCard({
  icon: Icon,
  title,
  children,
  className,
}: FormSectionCardProps) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-white p-6 shadow-sm", className)}
    >
      <div className="mb-5 flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}
