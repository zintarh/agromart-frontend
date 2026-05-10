import { ShoppingCart } from "lucide-react"
import { useSessionStore } from "@/store/sessionStore"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

const CART_COUNT = 3

export function DashboardHeader() {
  const user = useSessionStore((state) => state.user)
  const firstName = user?.first_name ?? "there"

  return (
    <header className="flex items-center justify-between px-4 pt-10 pb-2">
      <h2 className="text-lg font-medium text-foreground">
        {getGreeting()}, {firstName}
      </h2>

      <button className="relative">
        <ShoppingCart className="size-6 text-foreground" />
        {CART_COUNT > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
            {CART_COUNT}
          </span>
        )}
      </button>
    </header>
  )
}
