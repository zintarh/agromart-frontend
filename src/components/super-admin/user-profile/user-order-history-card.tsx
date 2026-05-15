import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { OrderStatusBadge } from "@/components/super-admin/shared/order-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type UserOrderHistoryCardProps = {
  profile: CustomerProfile
}

const headerClass =
  "h-10 px-0 text-xs font-semibold tracking-wide text-muted-foreground uppercase"

export function UserOrderHistoryCard({ profile }: UserOrderHistoryCardProps) {
  return (
    <ContentPanelCard title="Order History">
      <Table>
        <TableHeader>
          <TableRow className="border-[#EBEBEB] hover:bg-transparent">
            <TableHead className={cn(headerClass, "pl-0")}>Order</TableHead>
            <TableHead className={headerClass}>Date</TableHead>
            <TableHead className={headerClass}>Items</TableHead>
            <TableHead className={headerClass}>Total</TableHead>
            <TableHead className={cn(headerClass, "pr-0 text-right")}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profile.orderHistory.map((order) => (
            <TableRow key={order.orderId} className="border-[#EBEBEB] hover:bg-transparent">
              <TableCell className="px-0 py-3.5 text-sm font-medium text-foreground">
                {order.orderId}
              </TableCell>
              <TableCell className="py-3.5 text-sm text-muted-foreground">{order.date}</TableCell>
              <TableCell className="py-3.5 text-sm text-foreground">{order.items}</TableCell>
              <TableCell className="py-3.5 text-sm font-semibold text-foreground">
                {order.total}
              </TableCell>
              <TableCell className="py-3.5 pr-0 text-right">
                <OrderStatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-5 text-center text-sm font-semibold text-muted-foreground">
        View All Orders
      </p>
    </ContentPanelCard>
  )
}
