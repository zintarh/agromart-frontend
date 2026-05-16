import { Outlet, createFileRoute } from "@tanstack/react-router"

import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/categories")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: CategoriesLayout,
})

function CategoriesLayout() {
  return <Outlet />
}
