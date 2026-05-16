import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { CategoryCatalogContent } from "@/components/super-admin/category-management/category-catalog-content"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

const categoriesSearchSchema = z.object({
  mode: z.enum(["add"]).optional(),
})

export const Route = createFileRoute("/admin/categories/")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
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
