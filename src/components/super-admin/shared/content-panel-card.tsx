import { cn } from "@/lib/utils"

type ContentPanelCardProps = {
  title?: string
  children: React.ReactNode
  className?: string
}

export function ContentPanelCard({ title, children, className }: ContentPanelCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[#E8E8E8] bg-white p-6 shadow-none",
        className
      )}
    >
      {title && (
        <h2 className="mb-5 text-base font-semibold leading-none text-foreground">{title}</h2>
      )}
      {children}
    </section>
  )
}
