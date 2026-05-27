import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import { ActiveVendorCardItem } from "@/components/super-admin/vendor-portal/active-vendor-card"
import { activeVendorCards } from "@/components/super-admin/vendor-portal/mock-vendor-data"

export function ActiveVendorsGrid() {
  return (
    <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-[#111827]">Active Vednors</h2>
        <PrimaryActionButton label="New Application" to="/admin/applications" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeVendorCards.map((vendor) => (
          <ActiveVendorCardItem key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </section>
  )
}
