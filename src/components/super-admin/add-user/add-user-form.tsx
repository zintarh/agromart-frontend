"use client"

import { useState } from "react"

import { AccountInformationSection } from "@/components/super-admin/add-user/account-information-section"
import { AddUserFooterActions } from "@/components/super-admin/add-user/add-user-footer-actions"
import { RolePermissionsSection } from "@/components/super-admin/add-user/role-permissions-section"
import { UserProfileCard } from "@/components/super-admin/add-user/user-profile-card"
import { FormPageHeader } from "@/components/super-admin/shared/form-page-header"
import { useInviteUser } from "@/hooks/use-invite-user"
import {
  canInviteFromTab,
  getDefaultInviteRoleForTab,
  type SuperAdminInvitableRole,
} from "@/lib/super-admin-invitable-roles"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"

type AddUserFormProps = {
  activeTabId: UserManagementTabId
  onCancel: () => void
  onSuccess?: () => void
}

export function AddUserForm({ activeTabId, onCancel, onSuccess }: AddUserFormProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<SuperAdminInvitableRole>(() =>
    getDefaultInviteRoleForTab(activeTabId)
  )
  const { invite, isInviting } = useInviteUser()

  const canInvite = canInviteFromTab(activeTabId)

  const handleSubmit = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    await invite(trimmedEmail, role)
    onSuccess?.()
    onCancel()
  }

  return (
    <div className="flex flex-col gap-5">
      <FormPageHeader
        title="Invite Portal User"
        description="Send an invitation email. They will complete registration via the invite link (valid for 48 hours)."
      />

      {!canInvite ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Super admins cannot be invited directly. Promote an existing admin from the Admins tab
          instead.
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(280px,320px)_1fr]">
        <UserProfileCard />
        <div className="flex flex-col gap-5">
          <AccountInformationSection email={email} onEmailChange={setEmail} />
          <RolePermissionsSection role={role} onRoleChange={setRole} />
        </div>
      </div>

      <AddUserFooterActions
        onCancel={onCancel}
        onSubmit={() => void handleSubmit()}
        isSubmitting={isInviting}
        submitDisabled={!canInvite || !email.trim()}
      />
    </div>
  )
}
