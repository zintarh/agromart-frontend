import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { DetailRow } from "@/components/super-admin/shared/detail-row"

type ContactInfoCardProps = {
  profile: CustomerProfile
}

export function ContactInfoCard({ profile }: ContactInfoCardProps) {
  return (
    <ContentPanelCard title="Contact Info">
      <div className="divide-y divide-[#EBEBEB]">
        <DetailRow label="Full Name" value={profile.name} />
        <DetailRow label="Email" value={profile.email} />
        <DetailRow label="Phone" value={profile.phone} />
        <DetailRow label="Joined" value={profile.joinedDisplay} />
        <DetailRow label="Last Login" value={profile.lastLogin} />
      </div>
    </ContentPanelCard>
  )
}
