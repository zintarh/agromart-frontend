import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ADMIN_TABLE_PAGE_SIZE } from "@/lib/pagination"
import { cn } from "@/lib/utils"

type AdminTableSkeletonProps = {
  columns: number
  rows?: number
  firstColumnWithAvatar?: boolean
  headerClassName?: string
  cellClassName?: string
}

export function AdminTableSkeleton({
  columns,
  rows = ADMIN_TABLE_PAGE_SIZE,
  firstColumnWithAvatar = false,
  headerClassName,
  cellClassName,
}: AdminTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#EBEBEB] hover:bg-transparent">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead
              key={index}
              className={cn(
                "h-11 px-4",
                index === 0 && "px-6",
                index === columns - 1 && "pr-6",
                headerClassName
              )}
            >
              <Skeleton className="h-3 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="border-[#EBEBEB] hover:bg-transparent">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell
                key={colIndex}
                className={cn(
                  "py-4",
                  colIndex === 0 ? "px-6" : "px-4",
                  colIndex === columns - 1 && "pr-6",
                  cellClassName
                )}
              >
                {colIndex === 0 && firstColumnWithAvatar ? (
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ) : colIndex === columns - 1 ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-14 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                ) : (
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
