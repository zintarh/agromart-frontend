import { Mail, Star } from "lucide-react"

import type { CustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { ProfileActiveBadge } from "@/components/super-admin/shared/profile-active-badge"
import { StatMetricBox } from "@/components/super-admin/shared/stat-metric-box"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UserSummaryCardProps = {
  profile: CustomerProfile
}

export function UserSummaryCard({ profile }: UserSummaryCardProps) {
  const isActive = profile.status === "active"

  return (
    <ContentPanelCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
            style={{ backgroundColor: profile.summaryAvatarColor }}
          >
            {profile.summaryInitials}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-2">
              {isActive ? (
                <ProfileActiveBadge />
              ) : (
                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                  Suspended
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 rounded-lg border-[#E8E8E8] bg-white px-4 text-sm font-medium shadow-none hover:bg-white"
          >
            <Mail className="size-4 text-muted-foreground" strokeWidth={1.75} />
            Email
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 rounded-lg px-4 text-sm font-medium shadow-none",
              isActive
                ? "border-transparent bg-red-50 text-red-600 hover:bg-red-50"
                : "border-[#2D5A27]/30 bg-[#E8F5E9] text-[#2D5A27] hover:bg-[#E8F5E9]"
            )}
          >
            {isActive ? "Suspend" : "Enable"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatMetricBox value={String(profile.orders)} label="Orders" variant="mint" />
        <StatMetricBox value={profile.totalSpentShort} label="Total Spent" variant="peach" />
        <StatMetricBox
          value={
            <span className="inline-flex items-center gap-1">
              <Star className="size-5 fill-[#E6B800] text-[#E6B800]" strokeWidth={0} />
              {profile.rating.toFixed(1)}
            </span>
          }
          label="Rating"
          variant="yellow"
        />
      </div>
    </ContentPanelCard>
  )
}
