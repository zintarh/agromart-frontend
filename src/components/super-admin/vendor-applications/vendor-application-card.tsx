"use client"

import { Check, ClipboardList, X } from "lucide-react"

import { VendorApplicationStatusBadge } from "@/components/super-admin/vendor-applications/vendor-application-status-badge"
import {
  formatApplicationOwnerLine,
  type VendorApplication,
} from "@/components/super-admin/vendor-applications/mock-vendor-applications"
import { cn } from "@/lib/utils"

type VendorApplicationCardProps = {
  application: VendorApplication
  onReview?: (application: VendorApplication) => void
  onApprove?: (application: VendorApplication) => void
  onReject?: (application: VendorApplication) => void
}

const actionButtonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"

export function VendorApplicationCard({
  application,
  onReview,
  onApprove,
  onReject,
}: VendorApplicationCardProps) {
  const isPending = application.status === "pending"

  return (
    <article className="rounded-2xl border border-[#E8E8E8] bg-white px-5 py-5 md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold leading-tight text-[#111827]">
          {application.businessName}
        </h3>
        <VendorApplicationStatusBadge status={application.status} />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
        {formatApplicationOwnerLine(application)}
      </p>
      <p className="mt-1 text-xs text-[#9CA3AF]">Applied: {application.appliedAt}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onReview?.(application)}
          className={cn(
            actionButtonBase,
            "border border-[#E8E8E8] bg-white text-[#111827] hover:bg-[#FAFAFA]"
          )}
        >
          <ClipboardList className="size-4 shrink-0" strokeWidth={1.75} />
          Review Application
        </button>

        {isPending ? (
          <>
            <button
              type="button"
              onClick={() => onApprove?.(application)}
              className={cn(
                actionButtonBase,
                "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
              )}
            >
              Approve
              <Check className="size-4 shrink-0" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => onReject?.(application)}
              className={cn(
                actionButtonBase,
                "bg-[#FFEBEE] text-[#D32F2F] hover:bg-[#FFCDD2]"
              )}
            >
              Reject
              <X className="size-4 shrink-0" strokeWidth={2.5} />
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}
