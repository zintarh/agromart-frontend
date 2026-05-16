"use client"

import { useState } from "react"

import { InviteUserModal } from "@/components/super-admin/invite-user/invite-user-modal"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"

type InviteUserButtonProps = {
  activeTabId: UserManagementTabId
  onSuccess?: () => void
}

/** Opens the super-admin invite modal (POST /super-admin/invite). */
export function InviteUserButton({ activeTabId, onSuccess }: InviteUserButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PrimaryActionButton label="Invite User" onClick={() => setOpen(true)} />
      <InviteUserModal
        open={open}
        onOpenChange={setOpen}
        activeTabId={activeTabId}
        onSuccess={onSuccess}
      />
    </>
  )
}
