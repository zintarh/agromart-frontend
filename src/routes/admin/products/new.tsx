import { createFileRoute } from "@tanstack/react-router"

import { AddProductPage } from "@/components/super-admin/add-product/add-product-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/products/new")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: AddProductPage,
})
