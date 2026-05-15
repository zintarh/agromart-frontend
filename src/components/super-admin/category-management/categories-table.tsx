import { Pencil, Trash2 } from "lucide-react"

import { formatCategoryDate } from "@/lib/category-utils"
import type { CategoryRow } from "@/lib/categories-table-api"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type CategoriesTableProps = {
  categories: CategoryRow[]
  onEdit: (category: CategoryRow) => void
  onDelete: (category: CategoryRow) => void
}

const headerClass =
  "h-11 px-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase"

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#EBEBEB] hover:bg-transparent">
          <TableHead className={headerClass}>ID</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Category Name</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Slug</TableHead>
          <TableHead className={cn(headerClass, "px-4")}>Created</TableHead>
          <TableHead className={cn(headerClass, "pr-6 pl-4")}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id} className="border-[#EBEBEB] hover:bg-transparent">
            <TableCell className="px-6 py-4 text-sm text-muted-foreground">{category.id}</TableCell>
            <TableCell className="px-4 py-4 text-sm font-medium text-foreground">
              {category.name}
            </TableCell>
            <TableCell className="px-4 py-4 text-sm text-muted-foreground">{category.slug}</TableCell>
            <TableCell className="px-4 py-4 text-sm text-muted-foreground">
              {formatCategoryDate(category.created_at)}
            </TableCell>
            <TableCell className="pr-6 pl-4 py-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-lg border-[#E8E8E8] bg-white px-3 text-xs font-medium text-foreground shadow-none hover:bg-white"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-lg border-red-200 bg-white px-3 text-xs font-medium text-red-600 shadow-none hover:bg-white"
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
