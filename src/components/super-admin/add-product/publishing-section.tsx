import { Link } from "@tanstack/react-router"

import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type PublishingRowProps = {
  label: string
  description: string
  trailing: React.ReactNode
}

function PublishingRow({ label, description, trailing }: PublishingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {trailing}
    </div>
  )
}

type PublishingSectionProps = {
  onPublish?: () => void
  onSaveDraft?: () => void
}

export function PublishingSection({ onPublish, onSaveDraft }: PublishingSectionProps) {
  return (
    <FormSectionCard title="Publishing" className="flex h-full flex-col">
      <div className="flex-1">
        <PublishingRow
          label="Status"
          description="Control storefront visibility"
          trailing={
            <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-medium text-[#E67E22]">
              Pending
            </span>
          }
        />
        <PublishingRow
          label="Feature on Homepage"
          description="Show in banner and feature section"
          trailing={<Switch />}
        />
        <PublishingRow
          label="Low Stock Alert"
          description="Notify admin when below threshold"
          trailing={<Switch defaultChecked className="data-checked:bg-[#2D5A27]" />}
        />
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          onClick={onPublish}
          className="h-11 w-full rounded-lg bg-[#2D5A27] text-sm font-medium text-white hover:bg-[#2D5A27]/90"
        >
          Publish Product
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="h-11 w-full rounded-lg border-border bg-white text-sm font-medium"
        >
          Save as Draft
        </Button>
        <div className="pt-1 text-center">
          <Link
            to="/super-admin/products"
            className={cn("text-sm font-medium text-muted-foreground hover:text-foreground")}
          >
            Cancel
          </Link>
        </div>
      </div>
    </FormSectionCard>
  )
}
