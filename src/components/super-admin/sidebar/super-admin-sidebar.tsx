import { useRouterState } from "@tanstack/react-router"

import {
  isSidebarNavActive,
  superAdminNavSections,
} from "@/components/super-admin/sidebar/sidebar-nav-config"
import { SidebarNavItem } from "@/components/super-admin/sidebar/sidebar-nav-item"
import { SidebarNavSection } from "@/components/super-admin/sidebar/sidebar-nav-section"
import { SidebarUserProfile } from "@/components/super-admin/sidebar/sidebar-user-profile"

export function SuperAdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside className="flex h-full max-h-full w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/60">
      <div className="px-5 pt-6 pb-4">
        <p className="font-heading text-xl font-bold tracking-tight text-foreground">
          AgroMart
        </p>
        <p className="mt-0.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Admin Portal
        </p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-3 pb-4">
        {superAdminNavSections.map((section) => (
          <SidebarNavSection key={section.title} title={section.title}>
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                to={item.to}
                isActive={isSidebarNavActive(pathname, item.to)}
              />
            ))}
          </SidebarNavSection>
        ))}
      </nav>

      <SidebarUserProfile />
    </aside>
  )
}
