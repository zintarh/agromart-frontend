import { createFileRoute } from "@tanstack/react-router"

import { AnalyticsDashboardPage } from "@/components/super-admin/dashboard/analytics-dashboard-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: AnalyticsDashboardPage,
})
