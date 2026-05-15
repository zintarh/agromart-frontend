import { topProducts } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { DashboardSectionHeader } from "@/components/super-admin/shared/dashboard-section-header"
import { DashboardTableSkeleton } from "@/components/super-admin/shared/dashboard-table-skeleton"
import { dashboardLinks } from "@/lib/dashboard-links"

type TopProductsCardProps = {
  isLoading?: boolean
}

export function TopProductsCard({ isLoading = false }: TopProductsCardProps) {
  return (
    <DashboardCard>
      <DashboardSectionHeader
        title="Top 5 Products"
        linkLabel="Manage →"
        linkTo={dashboardLinks.products}
      />

      {isLoading ? (
        <DashboardTableSkeleton columns={4} rows={5} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-left">
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  #
                </th>
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Product
                </th>
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Unit Sold
                </th>
                <th className="pb-3 text-right font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.rank} className="border-b border-[#EBEBEB] last:border-0">
                  <td className="py-3.5 text-muted-foreground">{product.rank}</td>
                  <td className="py-3.5 font-medium text-foreground">{product.name}</td>
                  <td className="py-3.5 text-foreground">{product.unitsSold}</td>
                  <td className="py-3.5 text-right font-semibold text-foreground">
                    {product.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  )
}
