import { BadgePercent, CircleDollarSign, Tag, Package } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { InputWithIcon } from "@/components/super-admin/shared/input-with-icon"
import type { AddProductFormValues } from "@/lib/add-product-form"
import { useAdminUser } from "@/store/adminStore"

type PricingInventorySectionProps = {
  values: Pick<
    AddProductFormValues,
    "profitMargin" | "compareAtPrice" | "lowStockThreshold" | "minimumOrderQuantity"
  >
  onChange: (patch: Partial<AddProductFormValues>) => void
}

export function PricingInventorySection({ values, onChange }: PricingInventorySectionProps) {
  const user = useAdminUser()
  const isAdminRole = user?.role === "admin" || user?.role === "super_admin"

  return (
    <FormSectionCard icon={Tag} title="Pricing & Inventory">
      <div className="grid grid-cols-2 gap-4">
        {isAdminRole && (
          <FormField label="Profit Margin (%)">
            <InputWithIcon
              icon={BadgePercent}
              type="text"
              placeholder="30"
              value={values.profitMargin}
              onChange={(e) => onChange({ profitMargin: e.target.value })}
              className="placeholder:text-muted-foreground"
            />
          </FormField>
        )}
        <FormField label="Compare Price">
          <InputWithIcon
            icon={CircleDollarSign}
            type="text"
            placeholder="0.00"
            value={values.compareAtPrice}
            onChange={(e) => onChange({ compareAtPrice: e.target.value })}
            className="placeholder:text-muted-foreground"
          />
        </FormField>
        <FormField label="Low Stock Threshold">
          <InputWithIcon
            icon={CircleDollarSign}
            type="text"
            placeholder="10"
            value={values.lowStockThreshold}
            onChange={(e) => onChange({ lowStockThreshold: e.target.value })}
            className="placeholder:text-muted-foreground"
          />
        </FormField>
        <FormField label="Min. Order Quantity">
          <InputWithIcon
            icon={Package}
            type="text"
            placeholder="1"
            value={values.minimumOrderQuantity}
            onChange={(e) => onChange({ minimumOrderQuantity: e.target.value })}
            className="placeholder:text-muted-foreground"
          />
        </FormField>
      </div>
    </FormSectionCard>
  )
}
