import { Link } from "@tanstack/react-router"

import { recentOrders } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { DashboardOrderStatusPill } from "@/components/super-admin/shared/dashboard-order-status-pill"
import { DashboardSectionHeader } from "@/components/super-admin/shared/dashboard-section-header"
import { DashboardTableSkeleton } from "@/components/super-admin/shared/dashboard-table-skeleton"
import { dashboardLinks } from "@/lib/dashboard-links"

type RecentOrdersCardProps = {
  isLoading?: boolean
}

export function RecentOrdersCard({ isLoading = false }: RecentOrdersCardProps) {
  return (
    <DashboardCard>
      <DashboardSectionHeader
        title="Recent Order"
        linkLabel="Manage →"
        linkTo={dashboardLinks.orders}
      />

      {isLoading ? (
        <DashboardTableSkeleton columns={4} rows={5} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-left">
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Orders
                </th>
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Customer
                </th>
                <th className="pb-3 font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total
                </th>
                <th className="pb-3 text-right font-label text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-[#EBEBEB] last:border-0">
                  <td className="py-3.5 font-medium text-foreground">{order.orderId}</td>
                  <td className="py-3.5">
                    {order.customerId ? (
                      <Link
                        to="/super-admin/users/$userId"
                        params={{ userId: order.customerId }}
                        className="text-muted-foreground hover:text-[#2D5A27] hover:underline"
                      >
                        {order.customer}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{order.customer}</span>
                    )}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground">{order.total}</td>
                  <td className="py-3.5 text-right">
                    <DashboardOrderStatusPill status={order.status} />
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
