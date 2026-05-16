import { createFileRoute } from "@tanstack/react-router"

import { ensureAdminOperationsAccess } from "@/lib/portal-route-guard"

import { ComingSoonPage } from "@/components/super-admin/coming-soon/coming-soon-page"
import { superAdminComingSoonMeta } from "@/lib/super-admin-coming-soon-meta"

const meta = superAdminComingSoonMeta.orders

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: () => {
    ensureAdminOperationsAccess()
  },
  component: () => <ComingSoonPage title={meta.title} subtitle={meta.subtitle} />,
})
