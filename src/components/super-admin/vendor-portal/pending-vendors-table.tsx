import {
  pendingVendorCount,
  pendingVendorRows,
} from "@/components/super-admin/vendor-portal/mock-vendor-data"

export function PendingVendorsTable() {
  return (
    <section className="flex flex-col rounded-2xl border border-[#E8E8E8] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E8E8E8] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#111827]">Active Vendors</h2>
        <span className="text-sm font-medium text-[#E65100]">{pendingVendorCount} Pending</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-[0.06em] text-[#9CA3AF] uppercase">
                Vendor
              </th>
              <th className="px-3 py-3 text-[10px] font-semibold tracking-[0.06em] text-[#9CA3AF] uppercase">
                Amount
              </th>
              <th className="px-3 py-3 text-[10px] font-semibold tracking-[0.06em] text-[#9CA3AF] uppercase">
                Order
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.06em] text-[#9CA3AF] uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingVendorRows.map((row) => (
              <tr key={row.id} className="border-b border-[#EEEEEE] last:border-0">
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">{row.name}</td>
                <td className="px-3 py-4 text-sm font-bold text-[#111827]">{row.amount}</td>
                <td className="px-3 py-4 text-sm text-[#111827]">{row.orders}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col items-stretch gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-full min-w-[84px] items-center justify-center rounded-lg bg-[#6B8F63] px-3 text-xs font-medium text-white transition-colors hover:bg-[#5E7F56]"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 w-full min-w-[84px] items-center justify-center rounded-lg border border-[#E8E8E8] bg-white px-3 text-xs font-medium text-[#111827] transition-colors hover:bg-[#FAFAFA]"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
