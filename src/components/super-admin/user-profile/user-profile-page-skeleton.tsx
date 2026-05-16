import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfilePageSkeleton() {
  return (
    <SuperAdminLayout
      title="User Profile"
      subtitle="Loading user details…"
      showNotifications={false}
    >
      <Skeleton className="mb-5 h-5 w-48" />
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <ContentPanelCard>
            <ProfileSummaryHeaderSkeleton />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </ContentPanelCard>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="flex flex-col gap-5">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </SuperAdminLayout>
  )
}

function ProfileSummaryHeaderSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="size-14 shrink-0 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}
