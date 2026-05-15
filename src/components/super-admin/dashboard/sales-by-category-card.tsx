import { salesByCategory } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { DashboardCardSkeleton } from "@/components/super-admin/shared/dashboard-card-skeleton"
import { DashboardSectionHeader } from "@/components/super-admin/shared/dashboard-section-header"
import { SalesCategorySkeleton } from "@/components/super-admin/shared/sales-category-skeleton"
import { dashboardLinks } from "@/lib/dashboard-links"

type SalesByCategoryCardProps = {
  isLoading?: boolean
}

export function SalesByCategoryCard({ isLoading = false }: SalesByCategoryCardProps) {
  if (isLoading) {
    return (
      <DashboardCardSkeleton>
        <SalesCategorySkeleton />
      </DashboardCardSkeleton>
    )
  }

  return (
    <DashboardCard>
      <DashboardSectionHeader
        title="Sales by Category"
        linkLabel="Full Report →"
        linkTo={dashboardLinks.reports}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {salesByCategory.map((category, index) => (
          <div key={`${category.name}-${index}`}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <p className="text-sm font-semibold text-foreground">{category.value}</p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${category.percent}%`,
                  backgroundColor: category.barColor,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{category.percent}% of total</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
