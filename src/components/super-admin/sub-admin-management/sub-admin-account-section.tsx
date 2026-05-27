"use client"

import { useState } from "react"

import { PrimaryActionButton } from "@/components/super-admin/shared/primary-action-button"
import { SubAdminAccountRow } from "@/components/super-admin/sub-admin-management/sub-admin-account-row"
import {
  subAdminAccounts,
  type SubAdminAccount,
} from "@/components/super-admin/sub-admin-management/mock-sub-admin-data"

export function SubAdminAccountSection() {
  const [accounts, setAccounts] = useState(subAdminAccounts)

  const handleDeactivate = (account: SubAdminAccount) => {
    setAccounts((current) =>
      current.map((item) =>
        item.id === account.id ? { ...item, status: "inactive" as const } : item
      )
    )
  }

  return (
    <section className="rounded-2xl border border-[#E8E8E8] bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-[#111827]">Sub-Admin Account</h2>
        <PrimaryActionButton label="Add Sub-Admin" />
      </div>

      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <SubAdminAccountRow
            key={account.id}
            account={account}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>
    </section>
  )
}
