"use client"

import { useState } from "react"

import { CategoriesTableCard } from "@/components/super-admin/category-management/categories-table-card"
import { CategoryStatsGrid } from "@/components/super-admin/category-management/category-stats-grid"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"

type CategoryCatalogContentProps = {
  initialAddOpen?: boolean
}

export function CategoryCatalogContent({ initialAddOpen = false }: CategoryCatalogContentProps) {
  const [addModalOpen, setAddModalOpen] = useState(initialAddOpen)

  return (
    <div className="space-y-4">
      <CategoryStatsGrid />
      <div className="flex justify-end">
        <PrimaryActionButton label="Add Category" onClick={() => setAddModalOpen(true)} />
      </div>
      <CategoriesTableCard
        addModalOpen={addModalOpen}
        onAddModalOpenChange={setAddModalOpen}
      />
    </div>
  )
}
