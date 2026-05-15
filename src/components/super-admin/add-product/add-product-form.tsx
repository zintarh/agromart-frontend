import { BasicInformationSection } from "@/components/super-admin/add-product/basic-information-section"
import { PricingInventorySection } from "@/components/super-admin/add-product/pricing-inventory-section"
import { ProductImageSection } from "@/components/super-admin/add-product/product-image-section"
import { PublishingSection } from "@/components/super-admin/add-product/publishing-section"

type AddProductFormProps = {
  onPublish?: () => void
  onSaveDraft?: () => void
}

export function AddProductForm({ onPublish, onSaveDraft }: AddProductFormProps) {
  return (
    <div className="space-y-4">
      <BasicInformationSection />
      <PricingInventorySection />
      <div className="grid grid-cols-2 gap-4">
        <ProductImageSection />
        <PublishingSection onPublish={onPublish} onSaveDraft={onSaveDraft} />
      </div>
    </div>
  )
}
