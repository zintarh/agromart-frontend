import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { AcceptInvitePage } from "@/components/auth/accept-invite-page"
import { shouldRedirectAuthenticatedGuest } from "@/lib/auth-guard"
import { getPostInviteHomePath } from "@/lib/post-invite-redirect"
import { getUser } from "@/utils/storage"

const acceptInviteSearchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute("/accept-invite")({
  validateSearch: acceptInviteSearchSchema,
  beforeLoad: ({ search }) => {
    if (shouldRedirectAuthenticatedGuest()) {
      const user = getUser()
      throw redirect({ to: getPostInviteHomePath(user?.role) })
    }
    return search
  },
  component: AcceptInvitePage,
})
