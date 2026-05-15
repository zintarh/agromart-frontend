"use client"

import { useState } from "react"
import { Shield } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { FormSelect } from "@/components/super-admin/shared/form-select"

export function RolePermissionsSection() {
  const [role, setRole] = useState("")

  return (
    <FormSectionCard
      icon={Shield}
      title="Role & Permissions"
      className="border-[#E8E8E8] shadow-none"
    >
      <FormField label="User Role">
        <FormSelect
          value={role}
          onValueChange={setRole}
          placeholder="Select a role..."
          options={[]}
          triggerIcon="chevrons"
          className="rounded-lg border-[#E8E8E8]"
        />
      </FormField>
      <p className="mt-3 text-xs text-muted-foreground">
        Roles define the set of features this user can access by default.
      </p>
    </FormSectionCard>
  )
}
