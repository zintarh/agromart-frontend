import { ADMIN_TABLE_PAGE_SIZE, getPaginationRange } from "@/lib/pagination"
import { cn } from "@/lib/utils"

type TablePaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: TablePaginationProps) {
  if (totalItems <= ADMIN_TABLE_PAGE_SIZE) return null

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
              "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-[#2D5A27] text-white"
                : isEllipsis
                  ? "cursor-default text-[#9CA3AF]"
                  : "border border-[#E8E8E8] bg-white text-[#111827] hover:bg-[#FAFAFA]"
            )}
          >
            {page}
          </button>
        )
      })}
    </div>
  )
}
