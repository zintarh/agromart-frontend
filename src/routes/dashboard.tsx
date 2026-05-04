import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { LogOut, ShoppingBasket, Sprout, TrendingUp, Users } from "lucide-react"
import { useSessionStore } from "@/store/sessionStore"
import { authService } from "@/services/auth"
import { isAuthenticated } from "@/utils/storage"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" })
    }
  },
  component: DashboardPage,
})

const STAT_CARDS = [
  { label: "Total Orders", value: "—", icon: ShoppingBasket, color: "text-emerald-600 bg-emerald-50" },
  { label: "Active Listings", value: "—", icon: Sprout, color: "text-lime-600 bg-lime-50" },
  { label: "Revenue", value: "—", icon: TrendingUp, color: "text-yellow-600 bg-yellow-50" },
  { label: "Customers", value: "—", icon: Users, color: "text-green-600 bg-green-50" },
]

function DashboardPage() {
  const navigate = useNavigate()
  const { user, clearSession } = useSessionStore()

  const handleLogout = () => {
    authService.logout()
    clearSession()
    navigate({ to: "/login" })
  }

  const firstName = user?.first_name ?? "there"

  return (
    <main className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-input px-6 py-4">
        <div className="flex items-center gap-2">
          <Sprout className="size-6 text-primary" />
          <span className="text-lg font-bold text-primary">AgroMart</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-input hover:text-foreground"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        {/* Greeting */}
        <div className="space-y-1">
          <h1 className="text-foreground">Welcome back, {firstName} 👋</h1>
          <p className="text-sm text-foreground/60 capitalize">{user?.role ?? "user"} account</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-input bg-background p-5 space-y-3"
            >
              <span className={`inline-flex size-9 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-foreground/60">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div className="rounded-2xl border border-input bg-background p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <div className="space-y-2 text-sm text-foreground/70">
            <div className="flex justify-between">
              <span>Email</span>
              <span className="font-medium text-foreground">{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Name</span>
              <span className="font-medium text-foreground">
                {user ? `${user.first_name} ${user.last_name}` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
