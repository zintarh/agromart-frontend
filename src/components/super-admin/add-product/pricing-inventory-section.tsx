import { BadgePercent, CircleDollarSign, Tag } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { InputWithIcon } from "@/components/super-admin/shared/input-with-icon"

export function PricingInventorySection() {
  return (
    <FormSectionCard icon={Tag} title="Pricing & Inventory">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Profit Margin (%)" required>
          <InputWithIcon
            icon={BadgePercent}
            type="text"
            placeholder="30%"
            className="placeholder:text-muted-foreground"
          />
        </FormField>
        <FormField label="Compare Price">
          <InputWithIcon
            icon={CircleDollarSign}
            type="text"
            placeholder="0.00"
            className="placeholder:text-muted-foreground"
          />
        </FormField>
        <FormField label="Low Stock Alert Threshold" className="col-span-1">
          <InputWithIcon
            icon={CircleDollarSign}
            type="text"
            placeholder="0.00"
            className="placeholder:text-muted-foreground"
          />
        </FormField>
      </div>
    </FormSectionCard>
  )
}
