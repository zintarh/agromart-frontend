import { Outlet, createFileRoute } from "@tanstack/react-router"

import { ensureSuperAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/users")({
  beforeLoad: () => {
    ensureSuperAdminOperationsAccess()
  },
  component: UsersLayout,
})

function UsersLayout() {
  return <Outlet />
}
