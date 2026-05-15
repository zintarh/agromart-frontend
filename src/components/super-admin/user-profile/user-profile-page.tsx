"use client"

import { notFound } from "@tanstack/react-router"

import { getCustomerProfile } from "@/components/super-admin/customer-management/mock-customer-profile"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { PageBreadcrumb } from "@/components/super-admin/shared/page-breadcrumb"
import { AdminActionsCard } from "@/components/super-admin/user-profile/admin-actions-card"
import { ContactInfoCard } from "@/components/super-admin/user-profile/contact-info-card"
import { SavedAddressesCard } from "@/components/super-admin/user-profile/saved-addresses-card"
import { UserOrderHistoryCard } from "@/components/super-admin/user-profile/user-order-history-card"
import { UserProfileHeaderActions } from "@/components/super-admin/user-profile/user-profile-header-actions"
import { UserSummaryCard } from "@/components/super-admin/user-profile/user-summary-card"
import { Route } from "@/routes/super-admin/users/$userId"

export function UserProfilePage() {
  const { userId } = Route.useParams()
  const profile = getCustomerProfile(userId)

  if (!profile) {
    throw notFound()
  }

  return (
    <SuperAdminLayout
      title="User Profile"
      subtitle="Customer detail view"
      headerActions={<UserProfileHeaderActions />}
      showNotifications={false}
    >
      <div className="border-b border-[#EBEBEB] pb-5">
        <PageBreadcrumb
          className="mt-1"
          items={[
            { label: "Customers", to: "/super-admin/users" },
            { label: profile.name },
          ]}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <UserSummaryCard profile={profile} />
          <UserOrderHistoryCard profile={profile} />
        </div>
        <div className="flex flex-col gap-5">
          <ContactInfoCard profile={profile} />
          <SavedAddressesCard profile={profile} />
          <AdminActionsCard />
        </div>
      </div>
    </SuperAdminLayout>
  )
}
