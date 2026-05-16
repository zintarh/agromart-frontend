import { createFileRoute, redirect } from "@tanstack/react-router"

/** Legacy /super-admin/* paths → /admin/* */
export const Route = createFileRoute("/super-admin/$")({
  beforeLoad: ({ location, params }) => {
    const splat = params._splat
    const path = splat ? `/admin/${splat}` : "/admin"
    throw redirect({ to: path, search: location.search })
  },
})
