import { createFileRoute, redirect } from "@tanstack/react-router"

import { isClient } from "@/lib/auth-guard"
import { getPortalHomePath } from "@/lib/portal-roles"
import { syncPortalSessionFromStorage } from "@/lib/portal-session-sync"
import { useAdminStore } from "@/store/adminStore"

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    if (!isClient) return
    syncPortalSessionFromStorage()
    const role = useAdminStore.getState().user?.role
    throw redirect({ to: getPortalHomePath(role) })
  },
})
