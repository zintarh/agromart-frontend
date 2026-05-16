import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/super-admin/login")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/admin/login",
      search: location.search,
    })
  },
})
