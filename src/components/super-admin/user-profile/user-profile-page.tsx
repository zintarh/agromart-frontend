"use client"

import { notFound } from "@tanstack/react-router"

import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { PageBreadcrumb } from "@/components/super-admin/shared/page-breadcrumb"
import { AdminActionsCard } from "@/components/super-admin/user-profile/admin-actions-card"
import { ContactInfoCard } from "@/components/super-admin/user-profile/contact-info-card"
import { SavedAddressesCard } from "@/components/super-admin/user-profile/saved-addresses-card"
import { UserOrderHistoryCard } from "@/components/super-admin/user-profile/user-order-history-card"
import { UserProfileHeaderActions } from "@/components/super-admin/user-profile/user-profile-header-actions"
import { UserProfilePageSkeleton } from "@/components/super-admin/user-profile/user-profile-page-skeleton"
import { UserSummaryCard } from "@/components/super-admin/user-profile/user-summary-card"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Route } from "@/routes/admin/users/$userId"

export function UserProfilePage() {
  const { userId } = Route.useParams()
  const { profile, error, isLoading, reload } = useUserProfile(userId)

  if (isLoading) {
    return <UserProfilePageSkeleton />
  }

  if (!profile) {
    if (error?.toLowerCase().includes("not found")) {
      throw notFound()
    }

    return (
      <SuperAdminLayout
        title="User Profile"
        subtitle="Could not load this user"
        showNotifications={false}
      >
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <p className="text-sm text-destructive">{error ?? "Failed to load profile."}</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => void reload()}>
            Try again
          </Button>
        </div>
      </SuperAdminLayout>
    )
  }

  const breadcrumbLabel = profile.role === "user" ? "Customers" : "Users"

  return (
    <SuperAdminLayout
      title="User Profile"
      subtitle="User detail view"
      headerActions={<UserProfileHeaderActions />}
      showNotifications={false}
    >
      <ProfileBreadcrumb profileName={profile.name} breadcrumbLabel={breadcrumbLabel} />

      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <UserSummaryCard profile={profile} />
          <UserOrderHistoryCard profile={profile} />
        </div>
        <div className="flex flex-col gap-5">
          <ContactInfoCard profile={profile} />
          {profile.addresses.length > 0 ? <SavedAddressesCard profile={profile} /> : null}
          <AdminActionsCard />
        </div>
      </div>
    </SuperAdminLayout>
  )
}

function ProfileBreadcrumb({
  profileName,
  breadcrumbLabel,
}: {
  profileName: string
  breadcrumbLabel: string
}) {
  return (
    <div className="border-b border-[#EBEBEB] pb-5">
      <PageBreadcrumb
        className="mt-1"
        items={[
          { label: breadcrumbLabel, to: "/admin/users" },
          { label: profileName },
        ]}
      />
    </div>
  )
}
