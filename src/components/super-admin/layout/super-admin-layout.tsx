"use client"

import { SuperAdminHeader } from "@/components/super-admin/header/super-admin-header"
import { SuperAdminSidebar } from "@/components/super-admin/sidebar/super-admin-sidebar"

type SuperAdminLayoutProps = {
  children: React.ReactNode
  title: string
  subtitle: string
  headerActions?: React.ReactNode
  showNotifications?: boolean
}

export function SuperAdminLayout({
  children,
  title,
  subtitle,
  headerActions,
  showNotifications,
}: SuperAdminLayoutProps) {
  return (
    <div className="flex h-svh overflow-hidden bg-[#F5F5F5] p-4">
      <SuperAdminSidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-4">
        <SuperAdminHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          showNotifications={showNotifications}
        />
        <main className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {children}
        </main>
      </div>
    </div>
  )
}
