import { Mail, User } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { InputWithIcon } from "@/components/super-admin/shared/input-with-icon"
import { Input } from "@/components/ui/input"

export function AccountInformationSection() {
  return (
    <FormSectionCard
      icon={User}
      title="Account Information"
      className="border-[#E8E8E8] shadow-none"
    >
      <div className="space-y-5">
        <FormField label="Full Name">
          <InputWithIcon
            icon={User}
            placeholder="e.g. Jonathan Aris"
            className="rounded-lg border-[#E8E8E8]"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email Address">
            <InputWithIcon
              icon={Mail}
              type="email"
              placeholder="jonathan@agromart.com"
              className="rounded-lg border-[#E8E8E8]"
            />
          </FormField>
          <FormField label="Phone Number">
            <Input
              placeholder="+1 (555) 000-0000"
              className="h-10 rounded-lg border-[#E8E8E8] bg-white"
            />
          </FormField>
        </div>
      </div>
    </FormSectionCard>
  )
}
