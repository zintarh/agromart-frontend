"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { AlertCircle, Check, Circle, Eye, EyeOff, Phone, User } from "lucide-react"

import { LabeledInput } from "@/components/auth/labeled-input"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useCompleteInvite } from "@/hooks/auth/useCompleteInvite"
import { useAuthForm } from "@/hooks/useAuthForm"
import { getPostInviteHomePath } from "@/lib/post-invite-redirect"
import { completeInviteSchema } from "@/validations/auth"
import { Route } from "@/routes/accept-invite"

type CompleteInviteFormData = {
  token: string
  first_name: string
  last_name: string
  password: string
  confirm_password: string
  phone: string
  country_code: string
}

export function AcceptInvitePage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const { completeInvite, loadingState, error, clearError } = useCompleteInvite()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const inviteToken = token?.trim() ?? ""

  const form = useAuthForm<CompleteInviteFormData>(
    {
      token: inviteToken,
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
      phone: "",
      country_code: "234",
    },
    completeInviteSchema,
    { validateOnChange: true }
  )

  const isLoading = form.isSubmitting || loadingState === "loading"

  const passwordChecks = useMemo(
    () => ({
      hasUppercase: /[A-Z]/.test(form.values.password),
      hasLowercase: /[a-z]/.test(form.values.password),
      hasNumber: /[0-9]/.test(form.values.password),
      hasSpecialCharacter: /[^A-Za-z0-9]/.test(form.values.password),
      hasMinLength: form.values.password.length >= 8,
    }),
    [form.values.password]
  )

  useEffect(() => {
    if (inviteToken) {
      form.setValue("token", inviteToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL token once
  }, [inviteToken])

  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  if (!inviteToken) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-4">
        <section className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 text-lg font-semibold text-foreground">Invalid invitation link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This link is missing a token. Open the link from your invitation email or ask for a new
            invite.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/login">Go to login</Link>
          </Button>
        </section>
      </main>
    )
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSubmitError(null)
    clearError()
    form.setSubmitting(true)

    const isValid = await form.validateForm()
    if (!isValid) {
      form.setSubmitting(false)
      return
    }

    try {
      const { user } = await completeInvite({
        token: form.values.token.trim(),
        first_name: form.values.first_name.trim(),
        last_name: form.values.last_name.trim(),
        password: form.values.password,
        phone: form.values.phone.trim() || undefined,
        country_code: form.values.country_code,
      })

      void navigate({ to: getPostInviteHomePath(user?.role), replace: true })
    } catch (err: unknown) {
      const apiErr = err as {
        errorResponse?: { data?: { errors?: Array<{ field?: string; message?: string }> } }
      }
      const fieldErrors = apiErr?.errorResponse?.data?.errors
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((fieldError) => {
          const field = fieldError?.field
          const message = fieldError?.message
          if (!field || !message) return
          if (field in form.values) {
            form.setFieldError(field as keyof CompleteInviteFormData, message)
            form.setTouched(field as keyof CompleteInviteFormData, true)
          }
        })
      }
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Could not complete registration. The invite may have expired."
      )
      form.setSubmitting(false)
    }
  }

  const displayError = submitError || error

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {isLoading && <LoadingOverlay />}

      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-6 text-center">
          <h1 className="text-primary">Accept invitation</h1>
          <p className="pt-1.5 text-sm text-primary">
            Set up your account to join AgroMart (invite valid for 48 hours)
          </p>
        </header>

        {displayError ? <InviteErrorBanner message={displayError} /> : null}

        <form className="pt-8" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <LabeledInput
              label="First Name"
              placeholder="Jane"
              icon={<User className="size-4" />}
              value={form.values.first_name}
              onChange={(val) => form.setValue("first_name", val)}
              onBlur={() => form.setTouched("first_name", true)}
              error={form.touched.first_name ? form.errors.first_name : ""}
            />

            <LabeledInput
              label="Last Name"
              placeholder="Smith"
              icon={<User className="size-4" />}
              value={form.values.last_name}
              onChange={(val) => form.setValue("last_name", val)}
              onBlur={() => form.setTouched("last_name", true)}
              error={form.touched.last_name ? form.errors.last_name : ""}
            />

            <LabeledInput
              label="Phone Number"
              type="tel"
              placeholder="08098765432"
              icon={<Phone className="size-4" />}
              value={form.values.phone}
              onChange={(val) => form.setValue("phone", val)}
              onBlur={() => form.setTouched("phone", true)}
              error={form.touched.phone ? form.errors.phone : ""}
            />

            <LabeledInput
              label="Create Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              rightIcon={showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              rightIconAriaLabel={showPassword ? "Hide password" : "Show password"}
              value={form.values.password}
              onChange={(val) => form.setValue("password", val)}
              onBlur={() => form.setTouched("password", true)}
              error={form.touched.password ? form.errors.password : ""}
            />

            {form.values.password.length > 0 ? (
              <PasswordChecklist
                checks={[
                  { label: "1 uppercase", met: passwordChecks.hasUppercase },
                  { label: "1 lowercase", met: passwordChecks.hasLowercase },
                  { label: "1 number", met: passwordChecks.hasNumber },
                  { label: "minimum of 8 characters", met: passwordChecks.hasMinLength },
                  { label: "1 special character", met: passwordChecks.hasSpecialCharacter },
                ]}
              />
            ) : null}

            <LabeledInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              rightIcon={
                showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />
              }
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
              rightIconAriaLabel={showConfirmPassword ? "Hide password" : "Show password"}
              value={form.values.confirm_password}
              onChange={(val) => form.setValue("confirm_password", val)}
              onBlur={() => form.setTouched("confirm_password", true)}
              error={form.touched.confirm_password ? form.errors.confirm_password : ""}
            />
          </div>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-2xl font-bold"
            disabled={
              !form.values.first_name ||
              !form.values.last_name ||
              !form.values.password ||
              !form.values.confirm_password ||
              isLoading
            }
          >
            {isLoading ? "Creating account…" : "Complete registration"}
          </Button>

          <p className="pt-7 text-center text-sm text-foreground/90">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-foreground">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

function InviteErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-destructive/20 bg-destructive/5 p-3">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  )
}

type PasswordRule = { label: string; met: boolean }

function PasswordChecklist({ checks }: { checks: PasswordRule[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-2xl border border-input p-4 text-[10px]">
      {checks.map((check) => (
        <p
          key={check.label}
          className={`flex items-center gap-2 text-[10px] ${check.met ? "text-primary" : "text-destructive"}`}
        >
          {check.met ? <Check className="size-4" /> : <Circle className="size-4" />}
          {check.label}
        </p>
      ))}
    </div>
  )
}
