"use client"

import { useState } from "react"
import { Save, Shield } from "lucide-react"
import * as yup from "yup"

import { AccountInformationSection } from "@/components/super-admin/add-user/account-information-section"
import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { Button } from "@/components/ui/button"
import { useAdminInvite } from "@/hooks/use-admin-invite"
import {
  ADMIN_INVITABLE_ROLES,
  type AdminInvitableRole,
} from "@/lib/admin-invitable-roles"

const inviteSchema = yup.object({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  role: yup.mixed<AdminInvitableRole>().oneOf(["aggregator", "logistics"]).required(),
})

type AdminInviteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRole?: AdminInvitableRole
  onSuccess?: () => void
}

export function AdminInviteModal({
  open,
  onOpenChange,
  defaultRole = "aggregator",
  onSuccess,
}: AdminInviteModalProps) {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [role, setRole] = useState<AdminInvitableRole>(defaultRole)
  const { invite, isInviting } = useAdminInvite()

  const handleClose = () => {
    if (isInviting) return
    setEmail("")
    setEmailError(null)
    setRole(defaultRole)
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    try {
      const payload = await inviteSchema.validate({ email, role }, { abortEarly: false })
      setEmailError(null)
      await invite(payload.email, payload.role)
      onSuccess?.()
      setEmail("")
      onOpenChange(false)
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        setEmailError(err.errors[0] ?? "Enter a valid email address")
      }
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
        <>
          <Button
            type="button"
            variant="ghost"
            disabled={isInviting}
            onClick={handleClose}
            className="h-10 px-4 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isInviting || !email.trim()}
            onClick={() => void handleSubmit()}
            className="h-10 gap-2 rounded-lg bg-[#2D5A27] px-5 text-sm font-medium text-white hover:bg-[#2D5A27]/90"
          >
            <Save className="size-4" strokeWidth={2} />
            {isInviting ? "Sending…" : "Send invitation"}
          </Button>
        </>
      }
    >
      <p className="mb-5 text-sm text-muted-foreground">
        Send an invitation email. They will complete registration via the invite link (valid for 48
        hours).
      </p>

      <div className="flex flex-col gap-5">
        <AccountInformationSection
          email={email}
          onEmailChange={(value) => {
            setEmail(value)
            setEmailError(null)
          }}
        />
        {emailError ? <p className="-mt-3 text-sm text-destructive">{emailError}</p> : null}

        <FormSectionCard
          icon={Shield}
          title="Role & Permissions"
          className="border-[#E8E8E8] shadow-none"
        >
          <FormField label="User Role" required>
            <FormSelect
              value={role}
              onValueChange={(value) => setRole(value as AdminInvitableRole)}
              placeholder="Select a role..."
              options={ADMIN_INVITABLE_ROLES}
              triggerIcon="chevrons"
              className="rounded-lg border-[#E8E8E8]"
            />
          </FormField>
          <p className="mt-3 text-xs text-muted-foreground">
            Admins can invite aggregators and logistics users only.
          </p>
        </FormSectionCard>
      </div>
    </AdminModal>
  )
}
