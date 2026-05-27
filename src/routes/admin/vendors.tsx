import { createFileRoute } from "@tanstack/react-router"

import { VendorPortalPage } from "@/components/super-admin/vendor-portal/vendor-portal-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/vendors")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: VendorPortalPage,
})
