import { createFileRoute } from "@tanstack/react-router"

import { VendorApplicationsPage } from "@/components/super-admin/vendor-applications/vendor-applications-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/applications")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: VendorApplicationsPage,
})
