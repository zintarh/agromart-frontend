import { Download } from "lucide-react"

import { InviteUserButton } from "@/components/super-admin/invite-user/invite-user-button"
import { Button } from "@/components/ui/button"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"

type CustomerPageActionsProps = {
  activeTabId?: UserManagementTabId
  onInviteSuccess?: () => void
}

export function CustomerPageActions({
  activeTabId = "customers",
  onInviteSuccess,
}: CustomerPageActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="sr-only">User list</span>

      <div className="ml-auto flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-1.5 rounded-lg border-[#E8E8E8] bg-white px-4 text-sm font-medium text-foreground shadow-none hover:bg-white"
        >
          Export CSV
          <Download className="size-4 text-muted-foreground" />
        </Button>
        <InviteUserButton activeTabId={activeTabId} onSuccess={onInviteSuccess} />
      </div>
    </div>
  )
}
