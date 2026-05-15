import { createFileRoute } from "@tanstack/react-router"

import { ComingSoonPage } from "@/components/super-admin/coming-soon/coming-soon-page"
import { superAdminComingSoonMeta } from "@/lib/super-admin-coming-soon-meta"

const meta = superAdminComingSoonMeta["promo-codes"]

export const Route = createFileRoute("/super-admin/promo-codes")({
  component: () => <ComingSoonPage title={meta.title} subtitle={meta.subtitle} />,
})
