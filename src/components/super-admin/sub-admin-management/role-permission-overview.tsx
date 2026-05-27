import { Check, KeyRound } from "lucide-react"

import { rolePermissionColumns } from "@/components/super-admin/sub-admin-management/mock-sub-admin-data"

function PermissionCheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5">
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-[#2D5A27]"
        aria-hidden
      >
        <Check className="size-3 text-white" strokeWidth={3} />
      </span>
      <span className="text-sm text-[#374151]">{label}</span>
    </div>
  )
}

export function RolePermissionOverview() {
  return (
    <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
      <h2 className="mb-5 text-[15px] font-semibold text-[#111827]">
        Role Permission Overview
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rolePermissionColumns.map((column) => (
          <div key={column.id} className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <KeyRound className="size-4 text-[#6B7280]" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold text-[#111827]">{column.title}</h3>
            </div>

            <div className="flex flex-col gap-2">
              {column.permissions.map((permission) => (
                <PermissionCheckItem key={permission} label={permission} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
