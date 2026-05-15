"use client"

import { useMemo, useState } from "react"

import { revenueLast7Days } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { ChartTypeToggle, type ChartType } from "@/components/super-admin/shared/chart-type-toggle"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { DashboardCardSkeleton } from "@/components/super-admin/shared/dashboard-card-skeleton"
import { DashboardSectionHeader } from "@/components/super-admin/shared/dashboard-section-header"
import { Skeleton } from "@/components/ui/skeleton"

const chartWidth = 520
const chartHeight = 200
const padding = { top: 16, right: 8, bottom: 28, left: 40 }

type RevenueChartCardProps = {
  isLoading?: boolean
}

export function RevenueChartCard({ isLoading = false }: RevenueChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>("line")

  const { linePath, areaPath, bars, yLabels } = useMemo(() => {
    const max = Math.max(...revenueLast7Days.map((point) => point.value))
    const innerW = chartWidth - padding.left - padding.right
    const innerH = chartHeight - padding.top - padding.bottom

    const points = revenueLast7Days.map((point, index) => {
      const x = padding.left + (index / (revenueLast7Days.length - 1)) * innerW
      const y = padding.top + innerH - (point.value / max) * innerH
      return { ...point, x, y }
    })

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ")

    const area = `${line} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`

    const barWidth = innerW / revenueLast7Days.length - 12

    return {
      linePath: line,
      areaPath: area,
      bars: points.map((point) => ({
        x: point.x - barWidth / 2,
        y: point.y,
        width: barWidth,
        height: padding.top + innerH - point.y,
      })),
      yLabels: [0, 1, 2, 3, 4].map((index) => ({
        y: padding.top + (index / 4) * innerH,
        label: "N500",
      })),
    }
  }, [])

  if (isLoading) {
    return (
      <DashboardCardSkeleton minHeight="min-h-[300px]">
        <Skeleton className="h-[220px] w-full rounded-lg" />
      </DashboardCardSkeleton>
    )
  }

  return (
    <DashboardCard className="min-h-[300px]">
      <DashboardSectionHeader
        title="Revenue - Last 7 Days"
        trailing={<ChartTypeToggle value={chartType} onChange={setChartType} />}
      />

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-[220px] w-full"
        role="img"
        aria-label="Revenue chart for the last 7 days"
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2D5A27" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yLabels.map((label) => (
          <g key={label.y}>
            <text
              x={padding.left - 8}
              y={label.y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {label.label}
            </text>
            <line
              x1={padding.left}
              x2={chartWidth - padding.right}
              y1={label.y}
              y2={label.y}
              stroke="#EBEBEB"
              strokeWidth="1"
            />
          </g>
        ))}

        {chartType === "line" ? (
          <>
            <path d={areaPath} fill="url(#revenueFill)" />
            <path d={linePath} fill="none" stroke="#2D5A27" strokeWidth="2.5" />
            {revenueLast7Days.map((point, index) => {
              const x = padding.left + (index / (revenueLast7Days.length - 1)) * (chartWidth - padding.left - padding.right)
              const y = bars[index].y
              return <circle key={point.day} cx={x} cy={y} r="4" fill="#2D5A27" />
            })}
          </>
        ) : (
          bars.map((bar, index) => (
            <rect
              key={revenueLast7Days[index].day}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx="4"
              fill="#2D5A27"
            />
          ))
        )}

        {revenueLast7Days.map((point, index) => {
          const x =
            padding.left +
            (index / (revenueLast7Days.length - 1)) *
              (chartWidth - padding.left - padding.right)
          return (
            <text
              key={point.day}
              x={x}
              y={chartHeight - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.day}
            </text>
          )
        })}
      </svg>
    </DashboardCard>
  )
}
