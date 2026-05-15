import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/super-admin/users")({
  component: UsersLayout,
})

function UsersLayout() {
  return <Outlet />
}
