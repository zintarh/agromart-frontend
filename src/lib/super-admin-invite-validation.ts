import * as yup from "yup"

import type { SuperAdminInvitableRole } from "@/lib/super-admin-invitable-roles"

export const superAdminInviteSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  role: yup
    .string()
    .oneOf(["admin", "aggregator"], "Role must be admin or aggregator")
    .required("Role is required") as yup.Schema<SuperAdminInvitableRole>,
})

export type SuperAdminInviteFormValues = yup.InferType<typeof superAdminInviteSchema>
