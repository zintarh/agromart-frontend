"use client"

import { useState } from "react"

import { AddProductForm } from "@/components/super-admin/add-product/add-product-form"
import { AddProductHeaderActions } from "@/components/super-admin/add-product/add-product-header-actions"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ProductDraftSavedModal } from "@/components/super-admin/product-draft/product-draft-saved-modal"
import { ProductPublishedModal } from "@/components/super-admin/product-published/product-published-modal"

export function AddProductPage() {
  const [publishedOpen, setPublishedOpen] = useState(false)
  const [draftSavedOpen, setDraftSavedOpen] = useState(false)

  const handlePublish = () => setPublishedOpen(true)
  const handleSaveDraft = () => setDraftSavedOpen(true)

  return (
    <SuperAdminLayout
      title="Add Products"
      subtitle="Add New products"
      headerActions={<AddProductHeaderActions onPublish={handlePublish} />}
      showNotifications={false}
    >
      <AddProductForm onPublish={handlePublish} onSaveDraft={handleSaveDraft} />
      <ProductPublishedModal
        open={publishedOpen}
        onOpenChange={setPublishedOpen}
      />
      <ProductDraftSavedModal
        open={draftSavedOpen}
        onOpenChange={setDraftSavedOpen}
      />
    </SuperAdminLayout>
  )
}
