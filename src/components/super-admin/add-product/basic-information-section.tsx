"use client"

import { Info } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { Input } from "@/components/ui/input"
import { useAddProductCategories } from "@/hooks/use-add-product-categories"
import { cn } from "@/lib/utils"
import type { AddProductFormValues } from "@/lib/add-product-form"

const unitOptions = [
  { value: "kg", label: "Per kg" },
  { value: "g", label: "Per g" },
  { value: "piece", label: "Per piece" },
  { value: "bunch", label: "Per bunch" },
  { value: "crate", label: "Per crate" },
]

type BasicInformationSectionProps = {
  values: Pick<AddProductFormValues, "name" | "description" | "sku" | "categoryId" | "unit">
  onChange: (patch: Partial<AddProductFormValues>) => void
}

export function BasicInformationSection({ values, onChange }: BasicInformationSectionProps) {
  const { categoryOptions, isLoadingCategories } = useAddProductCategories()

  return (
    <FormSectionCard icon={Info} title="Basic Information">
      <div className="space-y-5">
        <FormField label="Product Name" required>
          <Input
            placeholder="e.g. Premium NPK Fertilizer"
            className="h-10 border-border bg-white"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <FormSelect
              value={values.categoryId}
              onValueChange={(categoryId) => onChange({ categoryId })}
              placeholder={isLoadingCategories ? "Loading…" : "Select Category"}
              options={categoryOptions}
              disabled={isLoadingCategories}
            />
          </FormField>
          <FormField label="Unit">
            <FormSelect
              value={values.unit}
              onValueChange={(unit) => onChange({ unit })}
              options={unitOptions}
            />
          </FormField>
        </div>

        <FormField label="SKU">
          <Input
            placeholder="e.g. SKU-001"
            className="h-10 border-border bg-white"
            value={values.sku}
            onChange={(e) => onChange({ sku: e.target.value })}
          />
        </FormField>

        <FormField label="Product Description">
          <textarea
            placeholder="Provide a detailed description of the product..."
            rows={4}
            value={values.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          />
        </FormField>
      </div>
    </FormSectionCard>
  )
}
