"use client"

import { useEffect, useId, useState } from "react"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CategoryRow } from "@/lib/categories-table-api"
import { cn } from "@/lib/utils"

const PRODUCE_TYPE_OPTIONS = [
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "grain", label: "Grain" },
  { value: "herb", label: "Herb" },
  { value: "legume", label: "Legume" },
  { value: "other", label: "Other" },
] as const

const FIELD_BORDER_CLASS = "border border-solid border-[#D1D5DB]"

const FIELD_INPUT_CLASS = cn(
  "h-12 rounded-xl bg-white px-4 text-sm text-foreground shadow-none placeholder:text-[#9CA3AF] focus-visible:ring-2 focus-visible:ring-[#2D5A27]/15",
  FIELD_BORDER_CLASS
)

const FIELD_SELECT_CLASS = cn(
  "h-12 rounded-xl bg-white px-4 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-[#2D5A27]/15",
  FIELD_BORDER_CLASS
)

const FIELD_TEXTAREA_CLASS = cn(
  "min-h-[120px] w-full resize-none rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-foreground shadow-none outline-none placeholder:text-[#9CA3AF] focus-visible:ring-2 focus-visible:ring-[#2D5A27]/15",
  FIELD_BORDER_CLASS
)

type CategoryFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  category?: CategoryRow | null
  isSubmitting?: boolean
  onSubmit: (name: string) => Promise<void>
}

type CategoryModalFieldProps = {
  label: string
  required?: boolean
  htmlFor: string
  children: React.ReactNode
}

function CategoryModalField({ label, required, htmlFor, children }: CategoryModalFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium leading-5 text-[#111827]">
        {label}
        {required ? <span className="text-[#EF4444]"> *</span> : null}
      </label>
      {children}
    </div>
  )
}

export function CategoryFormModal({
  open,
  onOpenChange,
  mode,
  category,
  isSubmitting = false,
  onSubmit,
}: CategoryFormModalProps) {
  const nameId = useId()
  const produceId = useId()
  const descriptionId = useId()

  const [name, setName] = useState("")
  const [produceType, setProduceType] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(mode === "edit" && category ? category.name : "")
      setProduceType("")
      setDescription("")
      setError(null)
    }
  }, [open, mode, category])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Category name is required")
      return
    }
    setError(null)
    try {
      await onSubmit(trimmed)
      onOpenChange(false)
    } catch {
      // Error surfaced via toast in parent
    }
  }

  const isCreate = mode === "create"

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? "Create Category" : "Edit Category"}
      showCloseButton={false}
      className="max-w-[640px] rounded-[24px]"
      headerClassName="border-[#E5E7EB] px-10 pb-5 pt-10"
      titleClassName="text-xl font-bold tracking-[-0.02em] text-[#111827]"
      bodyClassName="px-10 py-6"
      footerClassName="gap-3 border-t-0 px-10 pb-10 pt-0"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-11 min-w-[100px] rounded-lg border-[#D1D5DB] bg-white px-6 text-sm font-medium text-[#111827] shadow-none hover:bg-[#F9FAFB]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="h-11 min-w-[140px] rounded-lg bg-[#2D5A27] px-6 text-sm font-medium text-white shadow-none hover:bg-[#264B21]"
          >
            {isSubmitting
              ? "Saving…"
              : isCreate
                ? "Add category"
                : "Save changes"}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
        <CategoryModalField label="Category name" htmlFor={nameId}>
          <Input
            id={nameId}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Most common"
            className={FIELD_INPUT_CLASS}
            autoFocus
            aria-invalid={Boolean(error)}
          />
        </CategoryModalField>

        <CategoryModalField label="Produce types" required htmlFor={produceId}>
          <FormSelect
            value={produceType}
            onValueChange={setProduceType}
            options={[...PRODUCE_TYPE_OPTIONS]}
            placeholder="e.g. Vegetable"
            className={cn(FIELD_SELECT_CLASS, !produceType && "[&_span]:text-[#9CA3AF]")}
            triggerIcon="chevron"
          />
        </CategoryModalField>

        <CategoryModalField label="Description (optional)" htmlFor={descriptionId}>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. this category is for varieties of vegetables"
            rows={4}
            className={FIELD_TEXTAREA_CLASS}
          />
        </CategoryModalField>

        {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}
      </form>
    </AdminModal>
  )
}
