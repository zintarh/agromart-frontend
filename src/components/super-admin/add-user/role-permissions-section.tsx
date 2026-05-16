"use client"

import { Shield } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import {
  SUPER_ADMIN_INVITABLE_ROLES,
  type SuperAdminInvitableRole,
} from "@/lib/super-admin-invitable-roles"

type RolePermissionsSectionProps = {
  role: SuperAdminInvitableRole
  onRoleChange: (role: SuperAdminInvitableRole) => void
}

export function RolePermissionsSection({
  role,
  onRoleChange,
}: RolePermissionsSectionProps) {
  return (
    <FormSectionCard
      icon={Shield}
      title="Role & Permissions"
      className="border-[#E8E8E8] shadow-none"
    >
      <FormField label="User Role" required>
        <FormSelect
          value={role}
          onValueChange={(value) => onRoleChange(value as SuperAdminInvitableRole)}
          placeholder="Select a role..."
          options={SUPER_ADMIN_INVITABLE_ROLES}
          triggerIcon="chevrons"
          className="rounded-lg border-[#E8E8E8]"
        />
      </FormField>
      <p className="mt-3 text-xs text-muted-foreground">
        Super admins can invite admins and aggregators only. Logistics users are invited by admins.
        Super admins are promoted from existing admins.
      </p>
    </FormSectionCard>
  )
}
