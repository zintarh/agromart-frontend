import { Info } from "lucide-react"

export function SubAdminInfoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EBF8FF] px-4 py-3.5">
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]"
        aria-hidden
      >
        <Info className="size-3 text-white" strokeWidth={2.5} />
      </span>
      <p className="text-sm leading-relaxed text-[#374151]">
        Sub-Admin have restricted access based on their assigned roles. They cannot access
        billing, delete core data, or manage other admin
      </p>
    </div>
  )
}
