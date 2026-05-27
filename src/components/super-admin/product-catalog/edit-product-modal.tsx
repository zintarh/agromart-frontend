"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { ProductRecord, ProductStatus, UpdateProductRequest } from "@/api/product-types"
import { productsService } from "@/services/products"
import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSelect } from "@/components/super-admin/shared/form-select"
import { AdminModal } from "@/components/super-admin/shared/admin-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useAddProductCategories } from "@/hooks/use-add-product-categories"
import { useUpdateProduct } from "@/hooks/use-update-product"
import { normalizeProductUnit } from "@/lib/add-product-form"
import { showErrorToast } from "@/lib/api-toast"
import { productQueryKeys } from "@/lib/product-query-keys"
import type { CatalogProduct } from "@/lib/product-catalog-types"
import { cn } from "@/lib/utils"

type EditFormState = {
  name: string
  description: string
  sku: string
  categoryId: string
  unit: string
  profitMargin: string
  compareAtPrice: string
  lowStockThreshold: string
  minimumOrderQuantity: string
  isFeatured: boolean
  isOrganic: boolean
  status: ProductStatus
}

const defaultFormState: EditFormState = {
  name: "",
  description: "",
  sku: "",
  categoryId: "",
  unit: "kg",
  profitMargin: "",
  compareAtPrice: "",
  lowStockThreshold: "10",
  minimumOrderQuantity: "1",
  isFeatured: false,
  isOrganic: false,
  status: "pending",
}

const unitOptions = [
  { value: "kg", label: "Per kg" },
  { value: "g", label: "Per g" },
  { value: "piece", label: "Per piece" },
  { value: "bunch", label: "Per bunch" },
  { value: "crate", label: "Per crate" },
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

function parseOptionalInt(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseOptionalDecimal(value: string): string | undefined {
  const trimmed = value.trim().replace(/%/g, "")
  if (!trimmed) return undefined
  const parsed = Number.parseFloat(trimmed)
  if (!Number.isFinite(parsed)) return undefined
  return parsed.toFixed(2)
}

function recordToFormState(record: ProductRecord): EditFormState {
  return {
    name: record.name,
    description: record.description ?? "",
    sku: record.sku ?? "",
    categoryId: String(record.category_id),
    unit: record.unit ?? "kg",
    profitMargin: record.profit_margin ?? "",
    compareAtPrice: record.compare_at_price ?? "",
    lowStockThreshold: record.low_stock_threshold != null ? String(record.low_stock_threshold) : "10",
    minimumOrderQuantity: record.minimum_order_quantity != null ? String(record.minimum_order_quantity) : "1",
    isFeatured: Boolean(record.is_featured),
    isOrganic: Boolean(record.is_organic),
    status: record.status,
  }
}

function buildUpdatePayload(values: EditFormState): UpdateProductRequest {
  const name = values.name.trim()
  if (!name) throw new Error("Product name is required.")

  const categoryId = Number.parseInt(values.categoryId, 10)
  if (!Number.isFinite(categoryId) || categoryId <= 0) throw new Error("Select a category.")

  const payload: UpdateProductRequest = {
    name,
    category_id: categoryId,
    status: values.status,
    unit: normalizeProductUnit(values.unit),
    is_featured: values.isFeatured,
    is_organic: values.isOrganic,
  }

  const description = values.description.trim()
  if (description) payload.description = description

  const sku = values.sku.trim()
  if (sku) payload.sku = sku

  const lowStock = parseOptionalInt(values.lowStockThreshold)
  if (lowStock !== undefined) payload.low_stock_threshold = lowStock

  const minQty = parseOptionalInt(values.minimumOrderQuantity)
  if (minQty !== undefined) payload.minimum_order_quantity = minQty

  const compareAtPrice = parseOptionalDecimal(values.compareAtPrice)
  if (compareAtPrice) payload.compare_at_price = compareAtPrice

  const profitMargin = parseOptionalDecimal(values.profitMargin)
  if (profitMargin) payload.profit_margin = profitMargin

  return payload
}

type EditProductModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: CatalogProduct | null
  onUpdated: () => void
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  onUpdated,
}: EditProductModalProps) {
  const [values, setValues] = useState<EditFormState>(defaultFormState)

  const { categoryOptions, isLoadingCategories } = useAddProductCategories()
  const { updateProduct, isUpdating } = useUpdateProduct()

  const productId = product ? Number(product.id) : 0

  const { data: productRecord, isFetching } = useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsService.getById(productId),
    enabled: open && productId > 0,
  })

  useEffect(() => {
    if (productRecord) {
      setValues(recordToFormState(productRecord))
    }
  }, [productRecord])

  const patch = (partial: Partial<EditFormState>) =>
    setValues((prev) => ({ ...prev, ...partial }))

  const handleSubmit = async () => {
    let payload: UpdateProductRequest
    try {
      payload = buildUpdatePayload(values)
    } catch (err: unknown) {
      showErrorToast(err instanceof Error ? err.message : "Please check the form.")
      return
    }
    try {
      await updateProduct(Number(product?.id), payload)
      onUpdated()
      onOpenChange(false)
    } catch {
      // hook shows toast
    }
  }

  const isBusy = isFetching || isUpdating

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Product"
      className="max-w-2xl"
      bodyClassName="max-h-[70vh] overflow-y-auto"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isBusy}
            className="bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
          >
            {isUpdating ? "Saving…" : "Save Changes"}
          </Button>
        </>
      }
    >
      {isFetching ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product Name" required className="col-span-2">
              <Input
                value={values.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Premium NPK Fertilizer"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Category" required>
              <FormSelect
                value={values.categoryId}
                onValueChange={(categoryId) => patch({ categoryId })}
                placeholder={isLoadingCategories ? "Loading…" : "Select Category"}
                options={categoryOptions}
                disabled={isLoadingCategories || isBusy}
              />
            </FormField>

            <FormField label="Unit">
              <FormSelect
                value={values.unit}
                onValueChange={(unit) => patch({ unit })}
                options={unitOptions}
                disabled={isBusy}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={values.description}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Provide a detailed description…"
              rows={3}
              disabled={isBusy}
              className={cn(
                "w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              )}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="SKU">
              <Input
                value={values.sku}
                onChange={(e) => patch({ sku: e.target.value })}
                placeholder="e.g. SKU-001"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Status">
              <FormSelect
                value={values.status}
                onValueChange={(status) => patch({ status: status as ProductStatus })}
                options={statusOptions}
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Compare Price">
              <Input
                value={values.compareAtPrice}
                onChange={(e) => patch({ compareAtPrice: e.target.value })}
                placeholder="0.00"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Profit Margin (%)">
              <Input
                value={values.profitMargin}
                onChange={(e) => patch({ profitMargin: e.target.value })}
                placeholder="30"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Low Stock Threshold">
              <Input
                value={values.lowStockThreshold}
                onChange={(e) => patch({ lowStockThreshold: e.target.value })}
                placeholder="10"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>

            <FormField label="Min. Order Quantity">
              <Input
                value={values.minimumOrderQuantity}
                onChange={(e) => patch({ minimumOrderQuantity: e.target.value })}
                placeholder="1"
                className="h-10 border-border bg-white"
                disabled={isBusy}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-8 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3">
              <Switch
                checked={values.isFeatured}
                onCheckedChange={(isFeatured) => patch({ isFeatured })}
                disabled={isBusy}
                className="data-[state=checked]:bg-[#2D5A27]"
              />
              <span className="text-sm font-medium text-foreground">Featured</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <Switch
                checked={values.isOrganic}
                onCheckedChange={(isOrganic) => patch({ isOrganic })}
                disabled={isBusy}
                className="data-[state=checked]:bg-[#2D5A27]"
              />
              <span className="text-sm font-medium text-foreground">Organic</span>
            </label>
          </div>
        </div>
      )}
    </AdminModal>
  )
}
