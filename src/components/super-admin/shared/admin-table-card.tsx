type AdminTableCardProps = {
  children: React.ReactNode
}

export function AdminTableCard({ children }: AdminTableCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">{children}</div>
  )
}
