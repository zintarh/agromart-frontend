import { useEffect, useState } from "react"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { isAuthenticated } from "@/utils/storage"
import { Eye, EyeOff, Mail, AlertCircle } from "lucide-react"
import { LabeledInput } from "@/components/auth/labeled-input"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useLogin } from "@/hooks/auth/useLogin"
import { useAuthForm } from "@/hooks/useAuthForm"
import { loginSchema } from "@/validations/auth"

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

interface LoginFormData {
  email: string
  password: string
}

function LoginPage() {
  const navigate = Route.useNavigate()
  const { login, loadingState, error, clearError } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useAuthForm<LoginFormData>(
    {
      email: "",
      password: "",
    },
    loginSchema
  )


  const isLoading = form.isSubmitting || loadingState === "loading"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    clearError()

    const isValid = await form.validateForm()
    if (!isValid) return

    form.setSubmitting(true)
    try {
      await login(form.values.email, form.values.password)
      navigate({ to: "/dashboard" })
    } catch (err: any) {
      setSubmitError(err?.message || "Login failed. Please check your credentials.")
    } finally {
      form.setSubmitting(false)
    }
  }


  
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {isLoading && <LoadingOverlay />}
      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-primary">Welcome Back</h1>
          <p className="pt-1.5 text-sm text-primary">Log in to your account</p>
        </header>

        {/* Error Alert */}
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
            {/* Remember me intentionally hidden until backend/session policy support is implemented. */}
            <Link to="/forgot-password" className="text-[12px] font-semibold text-foreground">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-2xl font-bold"
            disabled={!form.values.email || !form.values.password || isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>

          <p className="pt-7 text-center text-sm text-foreground/90">
            Don&apos;t have an account ?{" "}
            <Link to="/create-account" className="font-bold text-foreground">
              Sign Up
            </Link>
          </p>

          <SocialAuthButtons mode="login" />
        </form>
      </section>
    </main>
  )
}
