"use client"

import { VendorApplicationCard } from "@/components/super-admin/vendor-applications/vendor-application-card"
import type { VendorApplication } from "@/components/super-admin/vendor-applications/mock-vendor-applications"

type VendorApplicationsListProps = {
  applications: VendorApplication[]
  onReview?: (application: VendorApplication) => void
  onApprove?: (application: VendorApplication) => void
  onReject?: (application: VendorApplication) => void
}

export function VendorApplicationsList({
  applications,
  onReview,
  onApprove,
  onReject,
}: VendorApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E8E8E8] bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#111827]">No applications in this tab</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          Applications will appear here once vendors submit them.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {applications.map((application) => (
        <li key={application.id}>
          <VendorApplicationCard
            application={application}
            onReview={onReview}
            onApprove={onApprove}
            onReject={onReject}
          />
        </li>
      ))}
    </ul>
  )
}
