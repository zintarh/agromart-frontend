import { createFileRoute } from "@tanstack/react-router"

import { UserProfilePage } from "@/components/super-admin/user-profile/user-profile-page"

export const Route = createFileRoute("/super-admin/users/$userId")({
  component: UserProfilePage,
})
