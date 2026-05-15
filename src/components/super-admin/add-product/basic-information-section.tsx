"use client"

import { useState } from "react"
import { Info } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categoryOptions = [
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "grains", label: "Grains" },
]

const unitOptions = [{ value: "per-kg", label: "Per kg" }]

export function BasicInformationSection() {
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("per-kg")

  return (
    <FormSectionCard icon={Info} title="Basic Information">
      <div className="space-y-5">
        <FormField label="Product Name" required>
          <Input
            placeholder="e.g. Premium NPK Fertilizer"
            className="h-10 border-border bg-white"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <FormSelect
              value={category}
              onValueChange={setCategory}
              placeholder="Select Category"
              options={categoryOptions}
            />
          </FormField>
          <FormField label="Unit">
            <FormSelect value={unit} onValueChange={setUnit} options={unitOptions} />
          </FormField>
        </div>

        <FormField label="Product Description">
          <textarea
            placeholder="Provide a detailed description of the product..."
            rows={4}
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          />
        </FormField>
      </div>
    </FormSectionCard>
  )
}
