"use client"

import { Eye, EyeOff, LogOut, type LucideIcon } from "lucide-react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export const SETTINGS_GREEN = "#2D5A27"

export const settingsInputClass =
  "h-11 rounded-[16px] border border-solid border-[#E8E8E8] bg-white text-sm text-foreground shadow-none placeholder:text-[#9CA3AF] focus-visible:border-[#E8E8E8] focus-visible:ring-2 focus-visible:ring-[#2D5A27]/15"

export function SettingsCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E8E8E8] bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </section>
  )
}

export function SettingsSectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#2D5A27]">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-[#6B7280]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function SettingsField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-[#374151]">{label}</label>
      {children}
    </div>
  )
}

export function SettingsInputWithIcon({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon: LucideIcon }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9CA3AF]" />
      <Input className={cn(settingsInputClass, "pl-9", className)} {...props} />
    </div>
  )
}

export function SettingsPasswordField({
  label,
  value,
  onChange,
  placeholder = "••••••••••",
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <SettingsField label={label} className={className}>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(settingsInputClass, "pr-10")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </SettingsField>
  )
}

export function SettingsMaskedKeyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <SettingsField label={label}>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(settingsInputClass, "pr-10 font-mono text-[13px]")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </SettingsField>
  )
}

export function SettingsBadge({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: "active" | "connected" | "configure"
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        variant === "active" && "bg-[#E8F5E9] text-[#2D5A27]",
        variant === "connected" && "bg-[#E8F5E9] text-[#2D5A27]",
        variant === "configure" && "bg-[#FFF3E0] text-[#E65100]"
      )}
    >
      {children}
    </span>
  )
}

export function SettingsToggleRow({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
}: {
  icon: LucideIcon
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 shrink-0 text-[#6B7280]" strokeWidth={1.75} />
        <span className="text-sm font-medium text-[#111827]">{label}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-checked:bg-[#2D5A27]"
      />
    </div>
  )
}

export function SettingsPrimaryButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-[#2D5A27] px-5 text-sm font-medium text-white transition-colors hover:bg-[#264B21] disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SettingsOutlineButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white px-4 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SettingsLogoutButton({
  onLogout,
  isLoggingOut,
  className,
}: {
  onLogout: () => void | Promise<void>
  isLoggingOut?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => void onLogout()}
      disabled={isLoggingOut}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border border-solid border-[#E8E8E8] bg-white text-sm font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:min-w-[140px]",
        className
      )}
    >
      <LogOut className="size-4 shrink-0 text-[#6B7280]" strokeWidth={1.75} aria-hidden />
      {isLoggingOut ? "Signing out…" : "Log out"}
    </button>
  )
}
