import { orderStatusSegments } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { DashboardCardSkeleton } from "@/components/super-admin/shared/dashboard-card-skeleton"
import { DashboardSectionHeader } from "@/components/super-admin/shared/dashboard-section-header"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardLinks } from "@/lib/dashboard-links"

const size = 180
const center = size / 2
const outerRadius = 72
const innerRadius = 46

function polarToCartesian(radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  }
}

function describeDonutSlice(startAngle: number, endAngle: number) {
  const startOuter = polarToCartesian(outerRadius, endAngle)
  const endOuter = polarToCartesian(outerRadius, startAngle)
  const startInner = polarToCartesian(innerRadius, startAngle)
  const endInner = polarToCartesian(innerRadius, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ")
}

type OrderStatusChartCardProps = {
  isLoading?: boolean
}

export function OrderStatusChartCard({ isLoading = false }: OrderStatusChartCardProps) {
  const total = orderStatusSegments.reduce((sum, segment) => sum + segment.percent, 0)
  let currentAngle = 0

  const slices = orderStatusSegments.map((segment) => {
    const sliceAngle = (segment.percent / total) * 360
    const start = currentAngle
    const end = currentAngle + sliceAngle
    currentAngle = end
    return { ...segment, path: describeDonutSlice(start, end) }
  })

  if (isLoading) {
    return (
      <DashboardCardSkeleton>
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="size-[180px] rounded-full" />
          <div className="grid w-full grid-cols-2 gap-2.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </DashboardCardSkeleton>
    )
  }

  return (
    <DashboardCard>
      <DashboardSectionHeader
        title="Order by status"
        linkLabel="View all"
        linkTo={dashboardLinks.orders}
      />

      <div className="flex flex-col items-center gap-6">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shrink-0"
          role="img"
          aria-label="Orders by status chart"
        >
          {slices.map((segment) => (
            <path key={segment.label} d={segment.path} fill={segment.color} />
          ))}
        </svg>

        <ul className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          {orderStatusSegments.map((segment) => (
            <li key={segment.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate text-foreground">{segment.label}</span>
              </span>
              <span className="shrink-0 text-muted-foreground">
                <span className="font-semibold text-foreground">{segment.count}</span>{" "}
                <span className="text-xs">({segment.percent}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  )
}
