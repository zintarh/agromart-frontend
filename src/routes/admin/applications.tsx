import { createFileRoute } from "@tanstack/react-router"

import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

import { ComingSoonPage } from "@/components/super-admin/coming-soon/coming-soon-page"
import { superAdminComingSoonMeta } from "@/lib/super-admin-coming-soon-meta"

const meta = superAdminComingSoonMeta.applications

export const Route = createFileRoute("/admin/applications")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: () => <ComingSoonPage title={meta.title} subtitle={meta.subtitle} />,
})
