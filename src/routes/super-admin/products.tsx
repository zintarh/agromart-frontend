import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/super-admin/products")({
  component: ProductsLayout,
})

function ProductsLayout() {
  return <Outlet />
}
