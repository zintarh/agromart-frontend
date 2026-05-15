import { Bell, Settings } from "lucide-react"

import { IconActionButton } from "@/components/super-admin/shared/icon-action-button"
import { Button } from "@/components/ui/button"

export function UserProfileHeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        className="h-10 rounded-lg bg-[#2D5A27] px-5 text-sm font-medium text-white hover:bg-[#2D5A27]/90"
      >
        Edit User
      </Button>
      <IconActionButton icon={Bell} label="Notifications" />
      <IconActionButton icon={Settings} label="Settings" />
    </div>
  )
}
