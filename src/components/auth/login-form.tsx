import { Link } from "@tanstack/react-router"
import { AlertCircle, Eye, EyeOff, Mail } from "lucide-react"
import { useEffect, useState } from "react"

import { LabeledInput } from "@/components/auth/labeled-input"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useAuthForm } from "@/hooks/useAuthForm"
import { loginSchema } from "@/validations/auth"

interface LoginFormData {
  email: string
  password: string
}

type LoginFormProps = {
  title?: string
  subtitle?: string
  isLoading: boolean
  error: string | null
  submitError: string | null
  onSubmit: (email: string, password: string) => Promise<void>
  onClearError: () => void
  showSocialAuth?: boolean
  showSignUpLink?: boolean
  forgotPasswordTo?: string
}

export function LoginForm({
  title = "Welcome Back",
  subtitle = "Log in to your account",
  isLoading,
  error,
  submitError,
  onSubmit,
  onClearError,
  showSocialAuth = true,
  showSignUpLink = true,
  forgotPasswordTo = "/forgot-password",
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useAuthForm<LoginFormData>(
    {
      email: "",
      password: "",
    },
    loginSchema
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onClearError()

    const isValid = await form.validateForm()
    if (!isValid) return

    form.setSubmitting(true)
    try {
      await onSubmit(form.values.email, form.values.password)
    } finally {
      form.setSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      onClearError()
    }
  }, [onClearError])

  const formLoading = form.isSubmitting || isLoading

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {formLoading && <LoadingOverlay />}
      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-primary">{title}</h1>
          <p className="pt-1.5 text-sm text-primary">{subtitle}</p>
        </header>

        {(submitError || error) && (
          <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{submitError || error}</p>
          </div>
        )}

        <form className="pt-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
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
              label="Password"
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
          </div>

          <div className="flex items-center justify-end pt-6">
            <Link to={forgotPasswordTo} className="text-[12px] font-semibold text-foreground">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-2xl font-bold"
            disabled={!form.values.email || !form.values.password || formLoading}
          >
            {formLoading ? "Logging in..." : "Log In"}
          </Button>

          {showSignUpLink && (
            <p className="pt-7 text-center text-sm text-foreground/90">
              Don&apos;t have an account ?{" "}
              <Link to="/create-account" className="font-bold text-foreground">
                Sign Up
              </Link>
            </p>
          )}

          {showSocialAuth && <SocialAuthButtons mode="login" />}
        </form>
      </section>
    </main>
  )
}
