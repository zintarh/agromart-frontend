"use client"

import { useEffect, useState } from "react"
import { Info, Mail, Save } from "lucide-react"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { InputWithIcon } from "@/components/super-admin/shared/input-with-icon"
import { Button } from "@/components/ui/button"
import { useInviteUser } from "@/hooks/use-invite-user"
import {
  canInviteFromTab,
  getDefaultInviteRoleForTab,
  type SuperAdminInvitableRole,
} from "@/lib/super-admin-invitable-roles"
import { SUPER_ADMIN_INVITABLE_ROLES } from "@/lib/super-admin-invitable-roles"
import { superAdminInviteSchema } from "@/lib/super-admin-invite-validation"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"
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
      title="Add Sub-Admin"
      footer={
        <InviteUserModalFooter
          canInvite={canInvite}
          email={email}
          isInviting={isInviting}
          onCancel={handleClose}
          onSubmit={() => void handleSubmit()}
        />
      }
      bodyClassName="px-8 py-7"
    >
      {!canInvite ? (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Super admins cannot be invited directly. Promote an existing admin from the Admins tab
          instead.
        </p>
      ) : (
        <InviteInfoBanner />
      )}

      <div className="mt-5 flex flex-col gap-4">
        <FormField label="Email" required>
          <InputWithIcon
            icon={Mail}
            type="email"
            placeholder="subadmin@agrofarm.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError(null)
            }}
            className="h-11 rounded-[16px] border-[#E8E8E8]"
          />
          {emailError ? <p className="mt-2 text-sm text-destructive">{emailError}</p> : null}
        </FormField>

        <FormField label="Role" required>
          <FormSelect
            value={role}
            onValueChange={(value) => setRole(value as SuperAdminInvitableRole)}
            placeholder="Select role"
            options={SUPER_ADMIN_INVITABLE_ROLES}
            triggerIcon="chevrons"
            className="h-11 rounded-[16px] border-[#E8E8E8]"
          />
        </FormField>
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
        variant="outline"
        onClick={onCancel}
        disabled={isInviting}
        className="h-10 rounded-lg border-[#E8E8E8] bg-white px-5 text-sm font-medium text-[#111827] shadow-none hover:bg-[#F9FAFB]"
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
        {isInviting ? "Sending…" : "Create Sub-Admin"}
      </Button>
    </>
  )
}

function InviteInfoBanner() {
  return (
    <div className="rounded-xl border border-[#93C5FD] bg-[#EFF6FF] px-4 py-3">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]"
          aria-hidden
        >
          <Info className="size-4 text-[#2563EB]" strokeWidth={2} />
        </span>
        <p className="text-sm leading-relaxed text-[#1F2937]">
          Sub-admins receive restricted access based on their assigned role. They cannot manage
          other admins or access billing.
        </p>
      </div>
    </div>
  )
}

