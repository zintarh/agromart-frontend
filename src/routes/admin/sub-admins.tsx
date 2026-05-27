import { createFileRoute } from "@tanstack/react-router"

import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

import { SubAdminManagementPage } from "@/components/super-admin/sub-admin-management/sub-admin-management-page"

export const Route = createFileRoute("/admin/sub-admins")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: SubAdminManagementPage,
})
