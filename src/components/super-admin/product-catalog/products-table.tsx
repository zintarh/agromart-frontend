import { Link } from "@tanstack/react-router"

import { ProductStatusBadge } from "@/components/super-admin/shared/product-status-badge"
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
import type { CatalogProduct } from "@/lib/product-catalog-types"
import { useAdminUser } from "@/store/adminStore"

type ProductsTableProps = {
  products: CatalogProduct[]
  onDelete: (product: CatalogProduct) => void
  onApprove?: (product: CatalogProduct) => void
  onReject?: (product: CatalogProduct) => void
  approvingId?: number | null
  rejectingId?: number | null
}

const headerClass =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase"

export function ProductsTable({
  products,
  onDelete,
  onApprove,
  onReject,
  approvingId,
  rejectingId,
}: ProductsTableProps) {
  const user = useAdminUser()
  const isAggregator = user?.role === "aggregator"

  if (products.length === 0) {
    return (
      <p className="px-5 py-10 text-sm text-muted-foreground">No products found.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className={cn(headerClass, "px-5")}>Product</TableHead>
          <TableHead className={headerClass}>Category</TableHead>
          <TableHead className={headerClass}>Unit</TableHead>
          <TableHead className={headerClass}>Price</TableHead>
          <TableHead className={headerClass}>Status</TableHead>
          <TableHead className={cn(headerClass, "pr-5")}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="border-border hover:bg-muted/30">
            <TableCell className="px-5 font-medium text-foreground">
              {product.name}
            </TableCell>
            <TableCell className="text-foreground">{product.category}</TableCell>
            <TableCell className="text-muted-foreground">{product.unit ?? "—"}</TableCell>
            <TableCell className="font-semibold text-foreground">{product.price}</TableCell>
            <TableCell>
              <ProductStatusBadge status={product.status} />
            </TableCell>
            <TableCell className="pr-5">
              <div className="flex flex-wrap items-center gap-2">
                {product.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-md border-green-200 bg-green-50 px-3 text-xs font-medium text-green-700 hover:bg-green-100"
                      disabled={approvingId === Number(product.id) || rejectingId === Number(product.id)}
                      onClick={() => onApprove?.(product)}
                    >
                      {approvingId === Number(product.id) ? "Approving…" : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-md border-orange-200 bg-orange-50 px-3 text-xs font-medium text-orange-700 hover:bg-orange-100"
                      disabled={approvingId === Number(product.id) || rejectingId === Number(product.id)}
                      onClick={() => onReject?.(product)}
                    >
                      {rejectingId === Number(product.id) ? "Rejecting…" : "Reject"}
                    </Button>
                  </>
                )}
                {(!isAggregator || product.status === "pending") && (
                  <Link
                    to="/admin/products/$productId"
                    params={{ productId: product.id }}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 rounded-md border-border bg-white px-3 text-xs font-medium hover:bg-muted/50"
                    )}
                  >
                    Edit
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-md border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(product)}
                >
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
