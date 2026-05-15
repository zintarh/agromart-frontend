import { AccountStatusBadge } from "@/components/super-admin/shared/account-status-badge"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { ProfilePhotoUpload } from "@/components/super-admin/shared/profile-photo-upload"

export function UserProfileCard() {
  return (
    <ContentPanelCard title="User Profile" className="flex h-full flex-col">
      <ProfilePhotoUpload />

      <div className="mt-6 border-t border-[#EBEBEB] pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Status</span>
          <AccountStatusBadge label="NEW ACCOUNT" />
        </div>
      </div>
    </ContentPanelCard>
  )
}
