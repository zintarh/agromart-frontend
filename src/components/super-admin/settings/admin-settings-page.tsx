"use client"

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  ClipboardList,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShoppingBag,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import { useState } from "react"

import { SuperAdminLayout } from "@/components/super-admin/layout/super-admin-layout"
import {
  SettingsBadge,
  SettingsCard,
  SettingsField,
  SettingsInputWithIcon,
  SettingsMaskedKeyField,
  SettingsLogoutButton,
  SettingsOutlineButton,
  SettingsPasswordField,
  SettingsPrimaryButton,
  SettingsSectionHeading,
  SettingsToggleRow,
  settingsInputClass,
} from "@/components/super-admin/settings/settings-ui"
import { Input } from "@/components/ui/input"
import { usePortalLogout } from "@/hooks/use-portal-logout"
import { useAdminUser } from "@/store/adminStore"
import {
  getAdminDisplayName,
  getAdminRoleLabel,
} from "@/types/admin-user"
const PROFILE_AVATAR_SRC =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face"

export function AdminSettingsPage() {
  const user = useAdminUser()
  const { logout, isLoggingOut } = usePortalLogout()

  const [fullName, setFullName] = useState(
    () => getAdminDisplayName(user) || "Aminu Ibrahim"
  )
  const [email, setEmail] = useState(() => user?.email ?? "john@example.com")
  const [phone, setPhone] = useState(() => user?.phone ?? "08167042797")
  const [role] = useState(() => getAdminRoleLabel(user) || "")

  const [storeName, setStoreName] = useState("AgroMarket Nigeria")
  const [currency, setCurrency] = useState("NGN (₦) - Nigerian Naira")
  const [minOrderAmount, setMinOrderAmount] = useState("₦ 5,000")
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("₦ 50,000")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newVendor: true,
    refundRequest: true,
    newUserRegistration: false,
    paymentReceived: true,
  })

  const [publicKey, setPublicKey] = useState("pk_test_••••••••••••••••")
  const [secretKey, setSecretKey] = useState("sk_test_••••••••••••••••")

  const profileEmail = user?.email ?? "admin@agrofarm.ng"
  const profileRoleLabel = getAdminRoleLabel(user) || "Super Admin"

  const headerActions = (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2D5A27] px-4 text-sm font-medium text-white transition-colors hover:bg-[#264B21]"
    >
      <Save className="size-4" strokeWidth={2} />
      Save All
    </button>
  )

  return (
    <SuperAdminLayout
      title="Settings"
      subtitle="System & account preferences"
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 items-start gap-5 pb-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <SettingsCard>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={PROFILE_AVATAR_SRC}
                  alt=""
                  className="size-16 rounded-full object-cover ring-2 ring-[#E8E8E8]"
                />
                <div>
                  <p className="text-base font-bold text-[#2D5A27]">{profileRoleLabel}</p>
                  <p className="mt-0.5 text-sm text-[#6B7280]">{profileEmail}</p>
                </div>
              </div>
              <SettingsOutlineButton type="button">Change Photo</SettingsOutlineButton>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SettingsField label="Full Name">
                <SettingsInputWithIcon
                  icon={User}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Aminu Ibrahim"
                />
              </SettingsField>
              <SettingsField label="Email Address">
                <SettingsInputWithIcon
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="john@example.com"
                />
              </SettingsField>
              <SettingsField label="Phone Number">
                <SettingsInputWithIcon
                  icon={Phone}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="08167042797"
                />
              </SettingsField>
              <SettingsField label="Role">
                <SettingsInputWithIcon
                  icon={User}
                  value={role}
                  readOnly
                  placeholder=""
                  className="text-[#9CA3AF]"
                />
              </SettingsField>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#F3F4F6] pt-6">
              <SettingsLogoutButton onLogout={logout} isLoggingOut={isLoggingOut} />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827]"
                >
                  Discard
                </button>
                <SettingsPrimaryButton type="button">Save Profile</SettingsPrimaryButton>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard>
            <SettingsSectionHeading
              title="Store Settings"
              subtitle="Manage regional and marketplace parameters"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SettingsField label="Store Name">
                <Input
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  className={settingsInputClass}
                />
              </SettingsField>
              <SettingsField label="Currency">
                <Input
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className={settingsInputClass}
                />
              </SettingsField>
              <SettingsField label="Min. Order Amount">
                <Input
                  value={minOrderAmount}
                  onChange={(event) => setMinOrderAmount(event.target.value)}
                  className={settingsInputClass}
                />
              </SettingsField>
              <SettingsField label="Free Delivery threshold">
                <Input
                  value={freeDeliveryThreshold}
                  onChange={(event) => setFreeDeliveryThreshold(event.target.value)}
                  className={settingsInputClass}
                />
              </SettingsField>
            </div>
          </SettingsCard>

          <SettingsCard>
            <SettingsSectionHeading title="Security" />
            <div className="space-y-5">
              <SettingsPasswordField
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <SettingsPasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <SettingsPasswordField
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <SettingsPrimaryButton type="button">Update Password</SettingsPrimaryButton>
            </div>
          </SettingsCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <SettingsCard>
            <SettingsSectionHeading
              title="Notification Preferences"
              subtitle="Control how you receive alerts"
            />
            <div className="divide-y divide-[#F3F4F6]">
              <SettingsToggleRow
                icon={ShoppingBag}
                label="New Order Alert"
                checked={notifications.newOrder}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, newOrder: checked }))
                }
              />
              <SettingsToggleRow
                icon={ClipboardList}
                label="Low Stock Alert"
                checked={notifications.lowStock}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, lowStock: checked }))
                }
              />
              <SettingsToggleRow
                icon={Users}
                label="New Vendor Application"
                checked={notifications.newVendor}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, newVendor: checked }))
                }
              />
              <SettingsToggleRow
                icon={ArrowLeft}
                label="Refund Request"
                checked={notifications.refundRequest}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, refundRequest: checked }))
                }
              />
              <SettingsToggleRow
                icon={UserPlus}
                label="New User Registration"
                checked={notifications.newUserRegistration}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, newUserRegistration: checked }))
                }
              />
              <SettingsToggleRow
                icon={Banknote}
                label="Payment Received"
                checked={notifications.paymentReceived}
                onCheckedChange={(checked) =>
                  setNotifications((n) => ({ ...n, paymentReceived: checked }))
                }
              />
            </div>
          </SettingsCard>

          <SettingsCard>
            <SettingsSectionHeading
              title="Payment Gateway"
              subtitle="Paystack integration settings"
              action={<SettingsBadge variant="active">ACTIVE</SettingsBadge>}
            />
            <div className="space-y-5">
              <SettingsMaskedKeyField
                label="API Public Key"
                value={publicKey}
                onChange={setPublicKey}
              />
              <SettingsMaskedKeyField
                label="Secret Key"
                value={secretKey}
                onChange={setSecretKey}
              />
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#2D5A27] hover:text-[#264B21]"
            >
              <RefreshCw className="size-4" strokeWidth={2} />
              Test Connection
            </button>
          </SettingsCard>

          <SettingsCard>
            <SettingsSectionHeading title="Integrations" />
            <ul className="space-y-4">
              <IntegrationRow
                title="SMS (Africa's Talking)"
                description="Order status SMS notifications"
                badge="CONNECTED"
                badgeVariant="connected"
              />
              <IntegrationRow
                title="Email (SendGrid)"
                description="Transactional email service"
                badge="CONNECTED"
                badgeVariant="connected"
              />
              <IntegrationRow
                title="Image Storage (Cloudinary)"
                description="Product image hosting"
                badge="CONFIGURE"
                badgeVariant="configure"
              />
            </ul>
          </SettingsCard>

          <SettingsCard className="border-[#FFCDD2]">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#C62828]" strokeWidth={2} />
              <h2 className="text-base font-semibold text-[#C62828]">Danger Zone</h2>
            </div>
            <div className="mb-5 rounded-lg border border-[#FFCDD2] bg-[#FFEBEE] px-4 py-3">
              <p className="text-sm leading-relaxed text-[#C62828]">
                These actions are permanent and cannot be undone. Please proceed with caution.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="h-11 w-full rounded-lg border border-[#EF9A9A] bg-white text-sm font-medium text-[#C62828] transition-colors hover:bg-[#FFEBEE]"
              >
                Clear Site Cache
              </button>
              <button
                type="button"
                className="h-11 w-full rounded-lg border border-[#EF9A9A] bg-white text-sm font-medium text-[#C62828] transition-colors hover:bg-[#FFEBEE]"
              >
                Reset Platform Data
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

function IntegrationRow({
  title,
  description,
  badge,
  badgeVariant,
}: {
  title: string
  description: string
  badge: string
  badgeVariant: "connected" | "configure"
}) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-[#F3F4F6] pb-4 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#111827]">{title}</p>
        <p className="mt-0.5 text-xs text-[#6B7280]">{description}</p>
      </div>
      <SettingsBadge variant={badgeVariant}>{badge}</SettingsBadge>
    </li>
  )
}
