import { createFileRoute } from "@tanstack/react-router"

import { AddProductPage } from "@/components/super-admin/add-product/add-product-page"

export const Route = createFileRoute("/super-admin/products/new")({
  component: AddProductPage,
})
