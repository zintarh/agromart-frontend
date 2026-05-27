import { Bell } from "lucide-react"

type SuperAdminHeaderProps = {
  title: string
  subtitle: string
  belowTitle?: React.ReactNode
  actions?: React.ReactNode
  showNotifications?: boolean
}

export function SuperAdminHeader({
  title,
  subtitle,
  belowTitle,
  actions,
  showNotifications = true,
}: SuperAdminHeaderProps) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        {belowTitle ? <div className="mt-2">{belowTitle}</div> : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {actions}
        {showNotifications && (
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-foreground transition-colors hover:bg-muted/50"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </header>
  )
}
