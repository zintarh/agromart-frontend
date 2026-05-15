import { Download } from "lucide-react"

import { PageBreadcrumb, type BreadcrumbItem } from "@/components/super-admin/shared/page-breadcrumb"
import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import { Button } from "@/components/ui/button"
import type { UserManagementTabId } from "@/lib/super-admin-user-list"

type CustomerPageActionsProps = {
  isAddUser: boolean
  activeTabId?: UserManagementTabId
  onBackToUsers?: () => void
}

export function CustomerPageActions({
  isAddUser,
  activeTabId = "customers",
}: CustomerPageActionsProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Users", to: "/super-admin/users" },
    { label: "Add New User" },
  ]

  return (
    <div className="flex items-center justify-between gap-4">
      {isAddUser ? (
        <PageBreadcrumb items={breadcrumbItems} />
      ) : (
        <span className="sr-only">User list</span>
      )}

      <div className="ml-auto flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-1.5 rounded-lg border-[#E8E8E8] bg-white px-4 text-sm font-medium text-foreground shadow-none hover:bg-white"
        >
          Export CSV
          <Download className="size-4 text-muted-foreground" />
        </Button>
        {!isAddUser && (
          <PrimaryActionButton
            label="Add Users"
            to="/super-admin/users"
            search={{ mode: "add-user", tab: activeTabId }}
          />
        )}
      </div>
    </div>
  )
}
