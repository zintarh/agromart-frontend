import type { AdminInvitableRole } from "@/api/admin-invite"

export type { AdminInvitableRole }

export const ADMIN_INVITABLE_ROLES: { value: AdminInvitableRole; label: string }[] = [
  { value: "aggregator", label: "Aggregator" },
  { value: "logistics", label: "Logistics" },
]
