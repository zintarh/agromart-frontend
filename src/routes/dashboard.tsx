import { createFileRoute, redirect } from "@tanstack/react-router"
import { shouldRequireAuth } from "@/lib/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SearchBar } from "@/components/dashboard/search-bar"
import { CategoryFilter } from "@/components/dashboard/category-filter"
import { PromoBanner } from "@/components/dashboard/promo-banner"
import { FeaturedProducts } from "@/components/dashboard/featured-products"
import { BottomNav } from "@/components/dashboard/bottom-nav"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (shouldRequireAuth()) {
      throw redirect({ to: "/login" })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <main className="min-h-svh bg-background pb-32">
      <div className="mx-auto max-w-2xl">
        <DashboardHeader />
        <div className="space-y-5 px-4 pt-2">
          <SearchBar />
          <CategoryFilter />
          <PromoBanner />
          <FeaturedProducts />
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
