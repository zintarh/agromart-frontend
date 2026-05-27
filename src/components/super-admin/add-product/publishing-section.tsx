import { Link } from "@tanstack/react-router"

import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { AddProductFormValues } from "@/lib/add-product-form"
import { useAdminUser } from "@/store/adminStore"

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
  values: Pick<AddProductFormValues, "isFeatured" | "isOrganic">
  onChange: (patch: Partial<AddProductFormValues>) => void
  onPublish?: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  statusDisplay?: React.ReactNode
  submitLabel?: string
  showSaveDraft?: boolean
}

export function PublishingSection({
  values,
  onChange,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  statusDisplay,
  submitLabel = "Publish Product",
  showSaveDraft = true,
}: PublishingSectionProps) {
  const user = useAdminUser()
  const isAdminRole = user?.role === "admin" || user?.role === "super_admin"

  const defaultStatusBadge = (
    <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-medium text-[#E67E22]">
      Pending
    </span>
  )

  return (
    <FormSectionCard title="Publishing" className="flex h-full flex-col">
      <div className="flex-1">
        <PublishingRow
          label="Status"
          description="Control storefront visibility"
          trailing={statusDisplay ?? defaultStatusBadge}
        />
        {isAdminRole && (
          <PublishingRow
            label="Feature on Homepage"
            description="Show in banner and feature section"
            trailing={
              <Switch
                checked={values.isFeatured}
                onCheckedChange={(isFeatured) => onChange({ isFeatured })}
                className="data-[state=checked]:bg-[#2D5A27]"
              />
            }
          />
        )}
        <PublishingRow
          label="Organic Product"
          description="Mark this product as organic"
          trailing={
            <Switch
              checked={values.isOrganic}
              onCheckedChange={(isOrganic) => onChange({ isOrganic })}
              className="data-[state=checked]:bg-[#2D5A27]"
            />
          }
        />
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onPublish}
          className="h-11 w-full rounded-lg bg-[#2D5A27] text-sm font-medium text-white hover:bg-[#2D5A27]/90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        {showSaveDraft && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onSaveDraft}
            className="h-11 w-full rounded-lg border-border bg-white text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save as Draft"}
          </Button>
        )}
        <div className="pt-1 text-center">
          <Link
            to="/admin/products"
            className={cn("text-sm font-medium text-muted-foreground hover:text-foreground")}
          >
            Cancel
          </Link>
        </div>
      </div>
    </FormSectionCard>
  )
}
