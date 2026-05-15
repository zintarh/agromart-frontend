"use client"

import { useEffect, useState } from "react"

import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { FormField } from "@/components/super-admin/shared/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CategoryRow } from "@/lib/categories-table-api"

type CategoryFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  category?: CategoryRow | null
  isSubmitting?: boolean
  onSubmit: (name: string) => Promise<void>
}

export function CategoryFormModal({
  open,
  onOpenChange,
  mode,
  category,
  isSubmitting = false,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(mode === "edit" && category ? category.name : "")
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

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Category" : "Edit Category"}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            className="bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : mode === "create" ? "Create Category" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Category Name" required>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Fresh Vegetables"
            className="h-11 border-[#E8E8E8] bg-white"
            autoFocus
          />
        </FormField>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {mode === "edit" && (
          <p className="text-xs text-muted-foreground">
            Slug updates automatically on the server when supported.
          </p>
        )}
      </form>
    </AdminModal>
  )
}
