import { Home, Search, ShoppingCart, User } from "lucide-react"

const NAV_ITEMS = [
  { label: "Home", icon: Home, active: true },
  { label: "Browse", icon: Search, active: false },
  { label: "Cart", icon: ShoppingCart, active: false },
  { label: "Profile", icon: User, active: false },
]

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="flex items-center justify-center w-full">
        <div className="bg-primary/10 w-full px-6 py-2 text-center text-xs font-medium text-primary">
        🚚 Free delivery on orders above ₦5,000
      </div>
      </div>
      <nav className="border-t border-input bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button key={label} className="flex flex-col items-center gap-1">
              <Icon
                className={`size-5 ${active ? "text-primary" : "text-foreground/40"}`}
                strokeWidth={active ? 2.5 : 1.75}
              />
              <span
                className={`text-[10px] font-medium ${active ? "text-primary" : "text-foreground/40"}`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
