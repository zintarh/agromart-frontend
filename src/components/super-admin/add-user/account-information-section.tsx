"use client"

import { Mail } from "lucide-react"

import { FormField } from "@/components/super-admin/shared/form-field"
import { FormSectionCard } from "@/components/super-admin/shared/form-section-card"
import { InputWithIcon } from "@/components/super-admin/shared/input-with-icon"

type AccountInformationSectionProps = {
  email: string
  onEmailChange: (email: string) => void
}

export function AccountInformationSection({
  email,
  onEmailChange,
}: AccountInformationSectionProps) {
  return (
    <FormSectionCard
      icon={Mail}
      title="Account Information"
      className="border-[#E8E8E8] shadow-none"
    >
      <FormField label="Email Address" required>
        <InputWithIcon
          icon={Mail}
          type="email"
          placeholder="newadmin@agromart.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="rounded-lg border-[#E8E8E8]"
        />
      </FormField>
      <p className="mt-3 text-xs text-muted-foreground">
        An invitation link will be sent to this address. Name and password are set when they accept
        the invite.
      </p>
    </FormSectionCard>
  )
}
