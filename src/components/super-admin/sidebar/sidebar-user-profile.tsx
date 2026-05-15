export function SidebarUserProfile() {
  return (
    <div className="flex items-center gap-3 border-t border-border px-4 py-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2D5A27] text-sm font-semibold text-white"
        aria-hidden
      >
        AD
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">Admin User</p>
        <p className="truncate text-xs text-muted-foreground">admin@agromart.ng</p>
      </div>
    </div>
  )
}
