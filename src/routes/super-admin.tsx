import { Outlet, createFileRoute } from "@tanstack/react-router"

import { SuperAdminAuthListener } from "@/components/super-admin/auth/super-admin-auth-listener"
import { ensureSuperAdminRouteAccess } from "@/lib/super-admin-route-guard"

export const Route = createFileRoute("/super-admin")({
  beforeLoad: ({ location }) => {
    ensureSuperAdminRouteAccess(location)
  },
  component: SuperAdminRouteLayout,
})

function SuperAdminRouteLayout() {
  return (
    <>
      <SuperAdminAuthListener />
      <Outlet />
    </>
  )
}
