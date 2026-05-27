"use client"

import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"

type VendorApplicationsHeaderActionsProps = {
  onManualEntry?: () => void
}

export function VendorApplicationsHeaderActions({
  onManualEntry,
}: VendorApplicationsHeaderActionsProps) {
  return <PrimaryActionButton label="Manual Entry" onClick={onManualEntry} />
}
