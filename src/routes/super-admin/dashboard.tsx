import { createFileRoute } from "@tanstack/react-router"

import { AnalyticsDashboardPage } from "@/components/super-admin/dashboard/analytics-dashboard-page"

export const Route = createFileRoute("/super-admin/dashboard")({
  component: AnalyticsDashboardPage,
})
