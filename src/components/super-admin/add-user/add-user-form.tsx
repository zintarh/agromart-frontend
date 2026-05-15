import { AccountInformationSection } from "@/components/super-admin/add-user/account-information-section"
import { AddUserFooterActions } from "@/components/super-admin/add-user/add-user-footer-actions"
import { RolePermissionsSection } from "@/components/super-admin/add-user/role-permissions-section"
import { UserProfileCard } from "@/components/super-admin/add-user/user-profile-card"
import { FormPageHeader } from "@/components/super-admin/shared/form-page-header"

type AddUserFormProps = {
  onCancel: () => void
}

export function AddUserForm({ onCancel }: AddUserFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <FormPageHeader
        title="Create New Portal User"
        description="Configure account details and access permissions for a new team member."
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(280px,320px)_1fr]">
        <UserProfileCard />
        <div className="flex flex-col gap-5">
          <AccountInformationSection />
          <RolePermissionsSection />
        </div>
      </div>

      <AddUserFooterActions onCancel={onCancel} />
    </div>
  )
}
