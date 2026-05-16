import { createFileRoute, redirect } from "@tanstack/react-router"

import { UserProfilePage } from "@/components/super-admin/user-profile/user-profile-page"
import { canViewPortalUserDetails } from "@/lib/portal-roles"
import { syncPortalSessionFromStorage } from "@/lib/portal-session-sync"
import { useAdminStore } from "@/store/adminStore"

export const Route = createFileRoute("/admin/users/$userId")({
  beforeLoad: () => {
    syncPortalSessionFromStorage()
    const user = useAdminStore.getState().user
    if (!canViewPortalUserDetails(user)) {
      throw redirect({ to: "/admin/users" })
    }
  },
  component: UserProfilePage,
})
