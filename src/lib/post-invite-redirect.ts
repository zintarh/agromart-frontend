import { getPortalHomePath, isPortalRole } from "@/lib/portal-roles"

/** Where to send the user after POST /auth/complete-invite succeeds. */
export function getPostInviteHomePath(role: string | undefined | null): string {
  if (isPortalRole(role)) {
    return getPortalHomePath(role)
  }

  if (role === "aggregator" || role === "logistics") {
    return "/dashboard"
  }

  return "/login"
}
