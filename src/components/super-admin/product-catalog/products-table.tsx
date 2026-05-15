import { Link } from "@tanstack/react-router"

import { ProductFeaturedStar } from "@/components/super-admin/product-catalog/product-featured-star"
import type { Product } from "@/components/super-admin/product-catalog/mock-products"
import { ActiveStatusBadge } from "@/components/super-admin/shared/active-status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ProductsTableProps = {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="px-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Product
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Category
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Vendor
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Stock
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Price
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Featured
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Status
          </TableHead>
          <TableHead className="pr-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="border-border">
            <TableCell className="px-5 font-medium text-foreground">
              {product.name}
            </TableCell>
            <TableCell className="text-foreground">{product.category}</TableCell>
            <TableCell className="text-foreground">{product.vendor}</TableCell>
            <TableCell className="text-foreground">{product.stock}</TableCell>
            <TableCell className="font-semibold text-foreground">{product.price}</TableCell>
            <TableCell>
              <ProductFeaturedStar featured={product.featured} />
            </TableCell>
            <TableCell>
              <ActiveStatusBadge />
            </TableCell>
            <TableCell className="pr-5">
              <div className="flex items-center gap-2">
                <Link
                  to="/super-admin/products/new"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 rounded-md border-border bg-white px-3 text-xs font-medium"
                  )}
                >
                  Edit
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-md border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Disable
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
