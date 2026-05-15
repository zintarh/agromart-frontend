import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DashboardTableSkeletonProps = {
  columns: number
  rows?: number
}

export function DashboardTableSkeleton({ columns, rows = 5 }: DashboardTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#EBEBEB] hover:bg-transparent">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index} className="pb-3">
              <Skeleton className="h-3 w-14" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="border-[#EBEBEB] hover:bg-transparent">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex} className="py-3.5">
                <Skeleton className="h-4 w-full max-w-[100px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
