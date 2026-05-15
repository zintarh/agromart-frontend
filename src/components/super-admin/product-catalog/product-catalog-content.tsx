import { ProductStatsGrid } from "@/components/super-admin/product-catalog/product-stats-grid"
import { ProductsTableCard } from "@/components/super-admin/product-catalog/products-table-card"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"

export function ProductCatalogContent() {
  return (
    <div className="space-y-4">
      <ProductStatsGrid />
      <div className="flex justify-end">
        <PrimaryActionButton label="Add Product" to="/super-admin/products/new" />
      </div>
      <ProductsTableCard />
    </div>
  )
}
