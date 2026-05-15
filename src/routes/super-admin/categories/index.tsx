import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { CategoryCatalogContent } from "@/components/super-admin/category-management/category-catalog-content"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"

const categoriesSearchSchema = z.object({
  mode: z.enum(["add"]).optional(),
})

export const Route = createFileRoute("/super-admin/categories/")({
  validateSearch: categoriesSearchSchema,
  component: CategoryManagementPage,
})

function CategoryManagementPage() {
  const { mode } = Route.useSearch()

  return (
    <SuperAdminLayout
      title="Category Management"
      subtitle="Organize products into categories"
    >
      <CategoryCatalogContent initialAddOpen={mode === "add"} />
    </SuperAdminLayout>
  )
}
