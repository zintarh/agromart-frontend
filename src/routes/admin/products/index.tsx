import { createFileRoute, Link } from "@tanstack/react-router"

import { ProductCatalogContent } from "@/components/super-admin/product-catalog/product-catalog-content"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/admin/products/")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: ProductCatalogPage,
})

function ProductCatalogPage() {
  return (
    <SuperAdminLayout
      title="Product Catalog"
      subtitle="Manage product listings"
      headerActions={
        <Link
          to="/admin/categories"
          search={{ mode: "add" }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 border-border bg-white px-4 text-sm font-medium text-foreground"
          )}
        >
          Add Product Category
        </Link>
      }
    >
      <ProductCatalogContent />
    </SuperAdminLayout>
  )
}
