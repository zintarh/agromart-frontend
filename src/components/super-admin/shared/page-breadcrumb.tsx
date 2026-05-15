import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  onClick?: () => void
  to?: string
}

type PageBreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="size-3.5 text-muted-foreground" strokeWidth={2} />
            )}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                search={{}}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ) : (
              <span
                className={cn(
                  "text-sm",
                  isLast ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
