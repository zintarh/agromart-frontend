import { createFileRoute, redirect } from "@tanstack/react-router"

/** Legacy URLs → /admin portal */
export const Route = createFileRoute("/super-admin")({
  beforeLoad: ({ location }) => {
    const path = location.pathname.replace(/^\/super-admin/, "/admin") || "/admin/dashboard"
    throw redirect({ to: path, search: location.search })
  },
})
