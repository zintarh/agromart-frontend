import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/super-admin/categories")({
  component: CategoriesLayout,
})

function CategoriesLayout() {
  return <Outlet />
}
