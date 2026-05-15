import { cn } from "@/lib/utils"

type SidebarNavSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}

export function SidebarNavSection({
  title,
  children,
  className,
}: SidebarNavSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="px-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
