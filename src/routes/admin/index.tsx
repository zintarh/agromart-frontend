import { createFileRoute, redirect } from "@tanstack/react-router"

import { getPortalHomePath } from "@/lib/portal-roles"
import { useAdminStore } from "@/store/adminStore"

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    const role = useAdminStore.getState().user?.role
    throw redirect({ to: getPortalHomePath(role) })
  },
})
