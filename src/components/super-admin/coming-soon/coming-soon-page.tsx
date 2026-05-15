import { ComingSoon } from "@/components/super-admin/shared/coming-soon"
import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"

type ComingSoonPageProps = {
  title: string
  subtitle?: string
}

export function ComingSoonPage({
  title,
  subtitle = "This section is coming soon.",
}: ComingSoonPageProps) {
  return (
    <SuperAdminLayout title={title} subtitle={subtitle}>
      <ComingSoon />
    </SuperAdminLayout>
  )
}
