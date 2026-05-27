"use client"

import { LogOut } from "lucide-react"

import { usePortalLogout } from "@/hooks/use-portal-logout"
import { cn } from "@/lib/utils"

export function SidebarLogoutButton() {
  const { logout, isLoggingOut } = usePortalLogout()

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={isLoggingOut}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
        "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      <LogOut className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
      <span>{isLoggingOut ? "Signing out…" : "Log out"}</span>
    </button>
  )
}
