import { createFileRoute, redirect } from "@tanstack/react-router"

import { EditProductPage } from "@/components/super-admin/add-product/edit-product-page"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

export const Route = createFileRoute("/admin/products/$productId")({
  beforeLoad: ({ params }) => {
    ensureAdminOperationsAccess()
    const id = Number(params.productId)
    if (!Number.isFinite(id) || id <= 0) {
      throw redirect({ to: "/admin/products" })
    }
  },
  component: EditProductRoute,
})

function EditProductRoute() {
  const { productId } = Route.useParams()
  return <EditProductPage productId={Number(productId)} />
}
