import { Info } from "lucide-react"

export function DraftInfoBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-full bg-muted/80 px-5 py-3.5 text-left">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-white">
        <Info className="size-3 text-muted-foreground" strokeWidth={2} />
      </span>
      <p className="text-xs leading-relaxed text-muted-foreground">
        You can find all your saved drafts in the Catalog. Use the &apos;Status&apos;
        filter to locate them quickly.
      </p>
    </div>
  )
}
