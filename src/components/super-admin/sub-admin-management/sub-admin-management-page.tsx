"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import { RolePermissionOverview } from "@/components/super-admin/sub-admin-management/role-permission-overview"
import { AdminInviteModal } from "@/components/super-admin/sub-admin-management/admin-invite-modal"
import { SubAdminInfoBanner } from "@/components/super-admin/sub-admin-management/sub-admin-info-banner"
import { SubAdminSection } from "@/components/super-admin/sub-admin-management/sub-admin-section"
import { InviteUserButton } from "@/components/super-admin/invite-user/invite-user-button"
import { ActionConfirmModal } from "@/components/shared/action-confirm-modal"
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal"
import type { Customer } from "@/components/super-admin/customer-management/mock-customers"
import { adminQueryKeys } from "@/lib/admin-query-keys"
import { superAdminQueryKeys } from "@/lib/super-admin-query-keys"
import type { SuperAdminUserListRole } from "@/lib/super-admin-user-list"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"
import { mapSuperAdminUserToCustomer } from "@/lib/map-super-admin-user-to-customer"
import { usePromoteAdmin } from "@/hooks/use-promote-admin"
import { useDeleteUser } from "@/hooks/use-delete-user"
import { useAdminUser } from "@/store/adminStore"
import { superAdminUsersService } from "@/services/super-admin-users"
import { adminUsersService } from "@/services/admin-users"
import { cn } from "@/lib/utils"

// ─── Shared fetcher helpers ────────────────────────────────────────────────────

async function fetchSuperAdminUsers(role: SuperAdminUserListRole): Promise<Customer[]> {
  const users = await superAdminUsersService.listByRole(role)
  return users.map((user, i) => mapSuperAdminUserToCustomer(user, i))
}

async function fetchAdminUsers(role: "aggregator" | "logistics"): Promise<Customer[]> {
  const users = role === "aggregator"
    ? await adminUsersService.listAggregators()
    : await adminUsersService.listLogistics()
  return users.map((user, i) => mapSuperAdminUserToCustomer(user, i))
}

// ─── Super-admin tabbed view ───────────────────────────────────────────────────

type SuperAdminSubTabId = "admins" | "super-admins" | "aggregators" | "logistics"

const SUPER_ADMIN_TABS: {
  id: SuperAdminSubTabId
  label: string
  role: SuperAdminUserListRole
  tabId: UserManagementTabId
}[] = [
  { id: "admins", label: "Admins", role: "admin", tabId: "admins" },
  { id: "super-admins", label: "Super Admins", role: "super_admin", tabId: "super-admins" },
  { id: "aggregators", label: "Aggregators", role: "aggregator", tabId: "aggregators" },
  { id: "logistics", label: "Logistics", role: "logistics", tabId: "logistics" },
]

function SuperAdminSubAdminTabs() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<SuperAdminSubTabId>("admins")
  const [userToPromote, setUserToPromote] = useState<Customer | null>(null)
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<Customer | null>(null)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const { promote } = usePromoteAdmin()
  const { deleteUser, isDeleting: isDeactivating } = useDeleteUser()

  const currentTab = SUPER_ADMIN_TABS.find((t) => t.id === activeTab)!

  const handleInviteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: superAdminQueryKeys.users.byRole(currentTab.role) })
  }

  const handleConfirmPromote = async () => {
    if (!userToPromote) return
    setPromotingId(userToPromote.id)
    try {
      await promote(Number(userToPromote.id))
      setUserToPromote(null)
    } finally {
      setPromotingId(null)
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return
    setDeactivatingId(userToDeactivate.id)
    try {
      await deleteUser(Number(userToDeactivate.id))
      setUserToDeactivate(null)
    } finally {
      setDeactivatingId(null)
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-[#F3F4F6] p-1">
            {SUPER_ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-[#111827] shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <InviteUserButton activeTabId={currentTab.tabId} onSuccess={handleInviteSuccess} />
        </div>

        <SubAdminSection
          role={currentTab.role}
          queryKey={superAdminQueryKeys.users.byRole(currentTab.role)}
          queryFn={() => fetchSuperAdminUsers(currentTab.role)}
          noCard
          onPromote={activeTab === "admins" ? setUserToPromote : undefined}
          promotingId={promotingId}
          onDeactivate={setUserToDeactivate}
          deactivatingId={deactivatingId}
        />
      </section>

      <ActionConfirmModal
        open={!!userToPromote}
        onOpenChange={(open) => { if (!open) setUserToPromote(null) }}
        variant="warning"
        title="Promote to Super Admin?"
        description={
          <>
            Are you sure you want to promote{" "}
            <span className="font-semibold text-foreground">
              {userToPromote?.name ?? "this user"}
            </span>{" "}
            to Super Admin? This will give them full platform access.
          </>
        }
        detail={userToPromote?.email}
        confirmLabel="Promote"
        confirmingLabel="Promoting…"
        isConfirming={!!promotingId}
        onConfirm={handleConfirmPromote}
      />

      <DeleteConfirmModal
        open={!!userToDeactivate}
        onOpenChange={(open) => { if (!open && !isDeactivating) setUserToDeactivate(null) }}
        title="Deactivate account?"
        description={
          <>
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-foreground">
              {userToDeactivate?.name ?? "this account"}
            </span>
            ? They will lose access to the platform.
          </>
        }
        detail={userToDeactivate?.email}
        confirmLabel="Deactivate"
        confirmingLabel="Deactivating…"
        isConfirming={isDeactivating}
        onConfirm={handleConfirmDeactivate}
      />
    </>
  )
}

// ─── Admin tabbed view (aggregators + logistics only) ─────────────────────────

type AdminSubTabId = "aggregators" | "logistics"

const ADMIN_TABS: {
  id: AdminSubTabId
  label: string
  role: "aggregator" | "logistics"
}[] = [
  { id: "aggregators", label: "Aggregators", role: "aggregator" },
  { id: "logistics", label: "Logistics", role: "logistics" },
]

function AdminSubAdminTabs() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AdminSubTabId>("aggregators")
  const [userToDeactivate, setUserToDeactivate] = useState<Customer | null>(null)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const { deleteUser, isDeleting: isDeactivating } = useDeleteUser()

  const currentTab = ADMIN_TABS.find((tab) => tab.id === activeTab)!

  const handleInviteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.byRole(currentTab.role) })
  }

  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return
    setDeactivatingId(userToDeactivate.id)
    try {
      await deleteUser(Number(userToDeactivate.id))
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.byRole(currentTab.role) })
      setUserToDeactivate(null)
    } finally {
      setDeactivatingId(null)
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-[#F3F4F6] p-1">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-[#111827] shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AdminInviteButton defaultRole={currentTab.role} onSuccess={handleInviteSuccess} />
        </div>

        <SubAdminSection
          role={currentTab.role}
          queryKey={adminQueryKeys.users.byRole(currentTab.role)}
          queryFn={() => fetchAdminUsers(currentTab.role)}
          noCard
          onDeactivate={setUserToDeactivate}
          deactivatingId={deactivatingId}
        />
      </section>

      <DeleteConfirmModal
        open={!!userToDeactivate}
        onOpenChange={(open) => {
          if (!open && !isDeactivating) setUserToDeactivate(null)
        }}
        title="Deactivate account?"
        description={
          <>
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-foreground">
              {userToDeactivate?.name ?? "this account"}
            </span>
            ? They will lose access to the platform.
          </>
        }
        detail={userToDeactivate?.email}
        confirmLabel="Deactivate"
        confirmingLabel="Deactivating…"
        isConfirming={isDeactivating}
        onConfirm={handleConfirmDeactivate}
      />
    </>
  )
}

function AdminInviteButton({
  defaultRole,
  onSuccess,
}: {
  defaultRole: "aggregator" | "logistics"
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  return (
    <>
      <PrimaryActionButton label="Invite User" onClick={() => setOpen(true)} />
      <AdminInviteModal
        open={open}
        onOpenChange={setOpen}
        defaultRole={defaultRole}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: adminQueryKeys.users.byRole(defaultRole) })
          onSuccess?.()
        }}
      />
    </>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function SubAdminManagementPage() {
  const user = useAdminUser()
  const isSuperAdmin = user?.role === "super_admin"

  return (
    <SuperAdminLayout
      title="Sub-Admin Management"
      subtitle="Roles & permission"
    >
      <div className="flex flex-col gap-5 pb-6">
        <SubAdminInfoBanner />
        {isSuperAdmin ? <SuperAdminSubAdminTabs /> : <AdminSubAdminTabs />}
        <RolePermissionOverview />
      </div>
    </SuperAdminLayout>
  )
}
