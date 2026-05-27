"use client"

import { useState } from "react"

import { InviteUserModal } from "@/components/super-admin/invite-user/invite-user-modal"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"

type AddUsersButtonProps = {
  onSuccess?: () => void
}

export function AddUsersButton({ onSuccess }: AddUsersButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PrimaryActionButton label="Add Users" onClick={() => setOpen(true)} />
      <InviteUserModal
        open={open}
        onOpenChange={setOpen}
        activeTabId="customers"
        onSuccess={onSuccess}
      />
    </>
  )
}
