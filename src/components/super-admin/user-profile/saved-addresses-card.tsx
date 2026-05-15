import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"

type SavedAddressesCardProps = {
  profile: CustomerProfile
}

export function SavedAddressesCard({ profile }: SavedAddressesCardProps) {
  return (
    <ContentPanelCard title="Saved Addresses">
      <div className="space-y-3">
        {profile.addresses.map((address) => (
          <div key={address.label} className="rounded-xl bg-[#F5F5F5] px-4 py-3.5">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {address.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{address.address}</p>
          </div>
        ))}
      </div>
    </ContentPanelCard>
  )
}
