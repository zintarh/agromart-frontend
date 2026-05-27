"use client"

import { useMemo, useState } from "react"

import { ActionConfirmModal } from "@/components/shared/action-confirm-modal"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { PageBreadcrumb } from "@/components/super-admin/shared/page-breadcrumb"
import { VendorApplicationsHeaderActions } from "@/components/super-admin/vendor-applications/vendor-applications-header-actions"
import { VendorApplicationsList } from "@/components/super-admin/vendor-applications/vendor-applications-list"
import {
  formatApplicationOwnerLine,
  vendorApplications,
  type VendorApplication,
  type VendorApplicationStatus,
} from "@/components/super-admin/vendor-applications/mock-vendor-applications"
import {
  VendorApplicationStatusTabs,
  type VendorApplicationTab,
} from "@/components/super-admin/vendor-applications/vendor-application-status-tabs"
import { showSuccessToast } from "@/lib/api-toast"

export function VendorApplicationsPage() {
  const [applications, setApplications] = useState(vendorApplications)
  const [activeTab, setActiveTab] = useState<VendorApplicationStatus>("pending")
  const [applicationToApprove, setApplicationToApprove] = useState<VendorApplication | null>(
    null
  )
  const [applicationToReject, setApplicationToReject] = useState<VendorApplication | null>(null)
  const [isMutating, setIsMutating] = useState(false)

  const tabs = useMemo<VendorApplicationTab[]>(() => {
    const countByStatus = (status: VendorApplicationStatus) =>
      applications.filter((app) => app.status === status).length

    return [
      { id: "pending", label: "Pending", count: countByStatus("pending") },
      { id: "approved", label: "Approved", count: countByStatus("approved") },
      { id: "rejected", label: "Rejected", count: countByStatus("rejected") },
    ]
  }, [applications])

  const filteredApplications = useMemo(
    () => applications.filter((app) => app.status === activeTab),
    [applications, activeTab]
  )

  const updateApplicationStatus = (
    applicationId: string,
    status: VendorApplicationStatus
  ) => {
    setApplications((current) =>
      current.map((app) => (app.id === applicationId ? { ...app, status } : app))
    )
  }

  const handleConfirmApprove = async () => {
    if (!applicationToApprove) return
    setIsMutating(true)
    try {
      updateApplicationStatus(applicationToApprove.id, "approved")
      showSuccessToast("Application approved", `${applicationToApprove.businessName} has been approved.`)
      setApplicationToApprove(null)
    } finally {
      setIsMutating(false)
    }
  }

  const handleConfirmReject = async () => {
    if (!applicationToReject) return
    setIsMutating(true)
    try {
      updateApplicationStatus(applicationToReject.id, "rejected")
      showSuccessToast("Application rejected", `${applicationToReject.businessName} has been rejected.`)
      setApplicationToReject(null)
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <SuperAdminLayout
      title="Vendor Application"
      subtitle="Review & approve application"
      belowTitle={
        <PageBreadcrumb
          items={[
            { label: "Vendor Portal", to: "/admin/vendors" },
            { label: "Application" },
          ]}
        />
      }
      headerActions={
        <VendorApplicationsHeaderActions
          onManualEntry={() =>
            showSuccessToast("Coming soon", "Manual vendor entry will be available soon.")
          }
        />
      }
    >
      <div className="flex flex-col gap-5 pb-6">
        <VendorApplicationStatusTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <VendorApplicationsList
          applications={filteredApplications}
          onReview={(application) =>
            showSuccessToast(
              "Review application",
              `Opening review for ${application.businessName}.`
            )
          }
          onApprove={setApplicationToApprove}
          onReject={setApplicationToReject}
        />
      </div>

      <ActionConfirmModal
        open={!!applicationToApprove}
        onOpenChange={(open) => {
          if (!open) setApplicationToApprove(null)
        }}
        variant="warning"
        title="Approve vendor application?"
        description={
          <>
            Approve{" "}
            <span className="font-semibold text-foreground">
              {applicationToApprove?.businessName ?? "this application"}
            </span>
            ? The vendor will gain access to list products on the marketplace.
          </>
        }
        detail={
          applicationToApprove
            ? formatApplicationOwnerLine(applicationToApprove)
            : undefined
        }
        confirmLabel="Approve"
        confirmingLabel="Approving…"
        isConfirming={isMutating}
        onConfirm={handleConfirmApprove}
      />

      <ActionConfirmModal
        open={!!applicationToReject}
        onOpenChange={(open) => {
          if (!open && !isMutating) setApplicationToReject(null)
        }}
        variant="danger"
        title="Reject vendor application?"
        description={
          <>
            Reject{" "}
            <span className="font-semibold text-foreground">
              {applicationToReject?.businessName ?? "this application"}
            </span>
            ? The applicant will be notified and can reapply later.
          </>
        }
        detail={
          applicationToReject ? formatApplicationOwnerLine(applicationToReject) : undefined
        }
        confirmLabel="Reject"
        confirmingLabel="Rejecting…"
        isConfirming={isMutating}
        onConfirm={handleConfirmReject}
      />
    </SuperAdminLayout>
  )
}
