"use client"

import { useEffect, useState } from "react"

import { AccountInformationSection } from "@/components/super-admin/add-user/account-information-section"
import { RolePermissionsSection } from "@/components/super-admin/add-user/role-permissions-section"
import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { Button } from "@/components/ui/button"
import { useInviteUser } from "@/hooks/use-invite-user"
import {
  canInviteFromTab,
  getDefaultInviteRoleForTab,
  type SuperAdminInvitableRole,
} from "@/lib/super-admin-invitable-roles"
import { superAdminInviteSchema } from "@/lib/super-admin-invite-validation"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"
import { Save } from "lucide-react"
import * as yup from "yup"

type InviteUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeTabId: UserManagementTabId
  onSuccess?: () => void
}

export function InviteUserModal({
  open,
  onOpenChange,
  activeTabId,
  onSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [role, setRole] = useState<SuperAdminInvitableRole>(() =>
    getDefaultInviteRoleForTab(activeTabId)
  )
  const { invite, isInviting } = useInviteUser()

  const canInvite = canInviteFromTab(activeTabId)

  useEffect(() => {
    if (open) {
      setRole(getDefaultInviteRoleForTab(activeTabId))
    }
  }, [activeTabId, open])

  const handleClose = () => {
    if (isInviting) return
    onOpenChange(false)
    setEmail("")
    setEmailError(null)
  }

  const handleSubmit = async () => {
    if (!canInvite) return

    try {
      const payload = await superAdminInviteSchema.validate(
        { email, role },
        { abortEarly: false }
      )
      setEmailError(null)
      await invite(payload.email, payload.role)
      onSuccess?.()
      setEmail("")
      onOpenChange(false)
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        setEmailError(err.errors[0] ?? "Enter a valid email address")
        return
      }
      // API errors toasts handled in hook
    }
  }

  return (
    <AdminModal
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose()
        else onOpenChange(true)
      }}
      title="Invite user"
      footer={
        <InviteUserModalFooter
          canInvite={canInvite}
          email={email}
          isInviting={isInviting}
          onCancel={handleClose}
          onSubmit={() => void handleSubmit()}
        />
      }
    >
      <p className="mb-5 text-sm text-muted-foreground">
        Send an invitation email. They will complete registration via the invite link (valid for 48
        hours).
      </p>

      {!canInvite ? (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Super admins cannot be invited directly. Promote an existing admin from the Admins tab
          instead.
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <AccountInformationSection
          email={email}
          onEmailChange={(value) => {
            setEmail(value)
            setEmailError(null)
          }}
        />
        {emailError ? <p className="-mt-3 text-sm text-destructive">{emailError}</p> : null}
        <RolePermissionsSection role={role} onRoleChange={setRole} />
      </div>
    </AdminModal>
  )
}

function InviteUserModalFooter({
  canInvite,
  email,
  isInviting,
  onCancel,
  onSubmit,
}: {
  canInvite: boolean
  email: string
  isInviting: boolean
  onCancel: () => void
  onSubmit: () => void
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={isInviting}
        className="h-10 px-4 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isInviting || !canInvite || !email.trim()}
        className="h-10 gap-2 rounded-lg bg-[#2D5A27] px-5 text-sm font-medium text-white hover:bg-[#2D5A27]/90"
      >
        <Save className="size-4" strokeWidth={2} />
        {isInviting ? "Sending…" : "Send invitation"}
      </Button>
    </>
  )
}
