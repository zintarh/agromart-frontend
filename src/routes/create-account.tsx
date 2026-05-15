import { useEffect, useMemo, useState } from "react"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { shouldRedirectAuthenticatedGuest } from "@/lib/auth-guard"
import { Check, Circle, Eye, EyeOff, Mail, Phone, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LabeledInput } from "@/components/auth/labeled-input"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useRegister } from "@/hooks/auth/useRegister"
import { useAuthForm } from "@/hooks/useAuthForm"
import { registerSchema } from "@/validations/auth"

export const Route = createFileRoute("/create-account")({
  beforeLoad: () => {
    if (shouldRedirectAuthenticatedGuest()) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: CreateAccountPage,
})




interface RegisterFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  agree_terms: boolean
  country_code: string
}

function CreateAccountPage() {
  const navigate = Route.useNavigate()
  const { register, loadingState, error, clearError } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useAuthForm<RegisterFormData>(
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      agree_terms: false,
      country_code: "234",
    },
    registerSchema,
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
    return () => { clearError() }
  }, [clearError])

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
      const nameParts = form.values.first_name.trim().split(" ")
      const firstName = nameParts[0] || form.values.first_name
      const lastName = form.values.last_name || nameParts.slice(1).join(" ") || firstName

      await register({
        first_name: firstName,
        last_name: lastName,
        email: form.values.email,
        phone: form.values.phone,
        country_code: form.values.country_code,
        password: form.values.password,
      })

      sessionStorage.setItem("verify_email", form.values.email)
      navigate({ to: "/verify-phone" })
    } catch (err: any) {
      const fieldErrors = err?.errorResponse?.data?.errors
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((fieldError: { field?: string; message?: string }) => {
          const field = fieldError?.field
          const message = fieldError?.message
          if (!field || !message) return
          if (field in form.values) {
            form.setFieldError(field as keyof RegisterFormData, message)
            form.setTouched(field as keyof RegisterFormData, true)
          }
        })
      }
      setSubmitError(
        err?.message ||
          err?.errorResponse?.data?.message ||
          "Registration failed. Please try again."
      )
      form.setSubmitting(false)
    }
  }

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {isLoading && <LoadingOverlay />}

      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-6 text-center">
          <h1 className="text-primary">Create Account</h1>
          <p className="pt-1.5 text-sm text-primary">Join us for fresh produce</p>
        </header>

        {(submitError || error) && (
          <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{submitError || error}</p>
          </div>
        )}

        <form className="pt-8" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <LabeledInput
              label="First Name"
              placeholder="John"
              icon={<User className="size-4" />}
              value={form.values.first_name}
              onChange={(val) => form.setValue("first_name", val)}
              onBlur={() => form.setTouched("first_name", true)}
              error={form.touched.first_name ? form.errors.first_name : ""}
            />

            <LabeledInput
              label="Last Name"
              placeholder="Doe"
              icon={<User className="size-4" />}
              value={form.values.last_name}
              onChange={(val) => form.setValue("last_name", val)}
              onBlur={() => form.setTouched("last_name", true)}
              error={form.touched.last_name ? form.errors.last_name : ""}
            />

            <LabeledInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="size-4" />}
              value={form.values.email}
              onChange={(val) => form.setValue("email", val)}
              onBlur={() => form.setTouched("email", true)}
              error={form.touched.email ? form.errors.email : ""}
            />

            <LabeledInput
              label="Phone Number"
              type="tel"
              placeholder="08167042797"
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

            {form.values.password.length > 0 && (
              <PasswordChecklist
                checks={[
                  { label: "1 uppercase", met: passwordChecks.hasUppercase },
                  { label: "1 lowercase", met: passwordChecks.hasLowercase },
                  { label: "1 number", met: passwordChecks.hasNumber },
                  { label: "minimum of 8 characters", met: passwordChecks.hasMinLength },
                  { label: "1 special character", met: passwordChecks.hasSpecialCharacter },
                ]}
              />
            )}

            <LabeledInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              rightIcon={showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
              rightIconAriaLabel={showConfirmPassword ? "Hide password" : "Show password"}
              value={form.values.confirm_password}
              onChange={(val) => form.setValue("confirm_password", val)}
              onBlur={() => form.setTouched("confirm_password", true)}
              error={form.touched.confirm_password ? form.errors.confirm_password : ""}
            />
          </div>

          <label className="flex items-center gap-3 pt-5 text-[12px] text-foreground/80">
            <input
              type="checkbox"
              checked={form.values.agree_terms}
              onChange={(event) => form.setValue("agree_terms", event.target.checked)}
              className="size-5 rounded-sm border border-input accent-primary"
            />
            <span>
              I agree to the <span className="font-semibold text-foreground">Terms & Condition</span>
            </span>
          </label>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-2xl font-bold"
            disabled={
              !form.values.first_name ||
              !form.values.last_name ||
              !form.values.email ||
              !form.values.phone ||
              !form.values.password ||
              !form.values.confirm_password ||
              !form.values.agree_terms ||
              isLoading
            }
          >
            {isLoading ? "Creating Account…" : "Sign Up"}
          </Button>

          <p className="pt-7 text-center text-sm text-foreground/90">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-foreground">
              Login
            </Link>
          </p>

          <SocialAuthButtons mode="signup" />
        </form>
      </section>
    </main>
  )
}

type PasswordRule = { label: string; met: boolean }

function PasswordChecklist({ checks }: { checks: PasswordRule[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-2xl border border-input p-4 text-[10px]">
      {checks.map((check) => (
        <p
          key={check.label}
          className={`text-[10px] flex items-center gap-2 ${check.met ? "text-primary" : "text-destructive"}`}
        >
          {check.met ? <Check className="size-4" /> : <Circle className="size-4" />}
          {check.label}
        </p>
      ))}
    </div>
  )
}
