import { createFileRoute } from "@tanstack/react-router"

import { AdminSettingsPage } from "@/components/super-admin/settings/admin-settings-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: AdminSettingsPage,
})
