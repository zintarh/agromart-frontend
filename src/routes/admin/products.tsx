import { Outlet, createFileRoute } from "@tanstack/react-router"

import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/products")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: ProductsLayout,
})

function ProductsLayout() {
  return <Outlet />
}
