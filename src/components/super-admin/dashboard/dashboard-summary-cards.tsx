import { Link } from "@tanstack/react-router"
import { CreditCard, Diamond, Truck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { dashboardSummaryCards } from "@/components/super-admin/dashboard/mock-dashboard-data"
import { DashboardCard } from "@/components/super-admin/shared/dashboard-card"
import { SummaryCardsSkeleton } from "@/components/super-admin/shared/summary-cards-skeleton"
import { cn } from "@/lib/utils"

const iconMap = {
  truck: Truck,
  tag: Diamond,
  card: CreditCard,
} satisfies Record<(typeof dashboardSummaryCards)[number]["icon"], LucideIcon>

type DashboardSummaryCardsProps = {
  isLoading?: boolean
}

export function DashboardSummaryCards({ isLoading = false }: DashboardSummaryCardsProps) {
  if (isLoading) {
    return <SummaryCardsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {dashboardSummaryCards.map((card) => {
        const Icon = iconMap[card.icon]

        return (
          <Link
            key={card.title}
            to={card.to}
            className="block transition-opacity hover:opacity-95"
          >
            <DashboardCard className="flex h-full items-start gap-4">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon className="size-6" style={{ color: card.iconColor }} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-3xl font-bold leading-none text-foreground">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{card.title}</p>
                <p className={cn("mt-1 font-label text-xs font-medium", card.footerClassName)}>
                  {card.footer}
                </p>
              </div>
            </DashboardCard>
          </Link>
        )
      })}
    </div>
  )
}
