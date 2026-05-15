import { getPaginationRange } from "@/lib/pagination"
import { cn } from "@/lib/utils"

type TablePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <div className="flex items-center gap-1.5 pt-4">
      {pages.map((page, index) => {
        const isEllipsis = page === "..."
        const isActive = !isEllipsis && page === currentPage

        return (
          <button
            key={isEllipsis ? `ellipsis-${index}` : page}
            type="button"
            disabled={isEllipsis}
            onClick={() => {
              if (!isEllipsis) onPageChange(page)
            }}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-[#2D5A27] text-white"
                : isEllipsis
                  ? "cursor-default text-muted-foreground"
                  : "border border-border bg-white text-foreground hover:bg-muted/50"
            )}
          >
            {page}
          </button>
        )
      })}
    </div>
  )
}
