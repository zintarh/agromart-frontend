import type { ActiveVendorCard } from "@/components/super-admin/vendor-portal/mock-vendor-data"

type ActiveVendorCardItemProps = {
  vendor: ActiveVendorCard
}

function VendorStatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-[#F0F0F0] px-2 py-3 text-center">
      <p className="text-sm font-bold leading-none text-[#111827]">{value}</p>
      <p className="mt-1.5 text-[11px] leading-none text-[#6B7280]">{label}</p>
    </div>
  )
}

export function ActiveVendorCardItem({ vendor }: ActiveVendorCardItemProps) {
  return (
    <article className="rounded-2xl border border-[#E8E8E8] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${vendor.avatarClassName}`}
            aria-hidden
          >
            {vendor.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#111827]">{vendor.name}</p>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">{vendor.location}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[10px] font-semibold text-[#2D5A27]">
          Active
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <VendorStatBox value={vendor.products} label="Product" />
        <VendorStatBox value={vendor.orders} label="Orders" />
        <VendorStatBox value={vendor.revenue} label="Revenue" />
      </div>
    </article>
  )
}
