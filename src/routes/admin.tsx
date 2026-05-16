import { createFileRoute } from "@tanstack/react-router"

import { PortalAuthListener } from "@/components/super-admin/auth/portal-auth-listener"
import { PortalRouteGate } from "@/components/super-admin/auth/portal-route-gate"
import { ensurePortalRouteAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    ensurePortalRouteAccess(location)
  },
  component: AdminPortalLayout,
})

function AdminPortalLayout() {
  return (
    <>
      <PortalAuthListener />
      <PortalRouteGate />
    </>
  )
}
