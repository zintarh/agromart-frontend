import { useEffect, useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { toast } from "sonner"
import { Mail, AlertCircle, Eye, EyeOff } from "lucide-react"
import { LabeledInput } from "@/components/auth/labeled-input"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useForgotPassword } from "@/hooks/auth/useForgotPassword"
import { useAuthForm } from "@/hooks/useAuthForm"
import { forgotPasswordSchema, newPasswordSchema } from "@/validations/auth"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
})

type Step = "email" | "otp" | "password"

function ForgotPasswordPage() {
  const navigate = Route.useNavigate()
  const { forgotPassword, resetPassword, loadingState, error, clearError } = useForgotPassword()

  const [step, setStep] = useState<Step>("email")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [requestedEmail, setRequestedEmail] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(900)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailForm = useAuthForm<{ email: string }>(
    { email: "" },
    forgotPasswordSchema
  )

  const passwordForm = useAuthForm<{ new_password: string; confirm_password: string }>(
    { new_password: "", confirm_password: "" },
    newPasswordSchema
  )

  const isLoading = emailForm.isSubmitting || passwordForm.isSubmitting || loadingState === "loading"

  // Countdown only runs on OTP step
  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return
    const id = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => window.clearInterval(id)
  }, [step, secondsLeft])

  useEffect(() => () => clearError(), [clearError])

  const timeDisplay = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`
  }, [secondsLeft])

  // Step 1 — send reset code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    clearError()
    emailForm.setSubmitting(true)
    const isValid = await emailForm.validateForm()
    if (!isValid) { emailForm.setSubmitting(false); return }
    try {
      await forgotPassword(emailForm.values.email)
      setRequestedEmail(emailForm.values.email)
      setSecondsLeft(900)
      setStep("otp")
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to send reset code. Please try again.")
    } finally {
      emailForm.setSubmitting(false)
    }
  }

  // Step 2 — verify OTP (no API call, just advance)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (otpValue.length !== 6) {
      setSubmitError("Please enter the complete 6-digit code.")
      return
    }
    setStep("password")
  }

  // Step 3 — submit new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    clearError()
    passwordForm.setSubmitting(true)
    const isValid = await passwordForm.validateForm()
    if (!isValid) { passwordForm.setSubmitting(false); return }
    try {
      await resetPassword(requestedEmail, otpValue, passwordForm.values.new_password)
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
      })
      navigate({ to: "/login" })
    } catch (err: any) {
      setSubmitError(err?.message || "Password reset failed. Please try again.")
    } finally {
      passwordForm.setSubmitting(false)
    }
  }

  const errorBanner = (submitError || error) && (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <p className="text-sm text-destructive">{submitError || error}</p>
    </div>
  )

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {isLoading && <LoadingOverlay />}

      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <>
            <header className="pt-20 text-center">
              <h1 className="text-primary">Forgot Password?</h1>
              <p className="pt-1.5 text-sm text-foreground/60">
                Enter your email and we'll send you a reset code
              </p>
            </header>

            {errorBanner}

            <form className="pt-10" onSubmit={handleRequestReset}>
              <LabeledInput
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                icon={<Mail className="size-4" />}
                value={emailForm.values.email}
                onChange={(val) => emailForm.setValue("email", val)}
                onBlur={() => emailForm.setTouched("email", true)}
                error={emailForm.touched.email ? emailForm.errors.email : ""}
              />

              <Button
                type="submit"
                className="mt-10 h-14 w-full rounded-2xl font-bold"
                disabled={!emailForm.values.email || isLoading}
              >
                {isLoading ? "Sending…" : "Send Reset Code"}
              </Button>
            </form>

            <p className="pt-8 text-center text-sm text-foreground/70">
              Remember your password?{" "}
              <Link to="/login" className="font-bold text-foreground">
                Back to Login
              </Link>
            </p>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <>
            <header className="pt-16 text-center">
              <h1 className="text-primary">Check Your Email</h1>
              <p className="pt-1.5 text-sm text-foreground/60">We sent a 6-digit code to</p>
              <p className="pt-2 font-semibold text-foreground break-all">{requestedEmail}</p>
            </header>

            {errorBanner}

            <form className="pt-10" onSubmit={handleVerifyOtp}>
              <div
                onPasteCapture={(e) => {
                  const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
                  if (digits.length > 0) { e.preventDefault(); setOtpValue(digits) }
                }}
              >
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  containerClassName="w-full justify-center"
                >
                  <InputOTPGroup className="w-full justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="size-14 rounded-xl border text-2xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="mt-3 text-center text-xs text-foreground/50">
                Code expires in <span className="font-semibold text-primary">{timeDisplay}</span>
              </p>

              <Button
                type="submit"
                className="mt-10 h-14 w-full rounded-2xl font-bold"
                disabled={otpValue.length !== 6}
              >
                Continue
              </Button>
            </form>

            <p className="pt-6 text-center text-sm text-foreground/70">
              Wrong email?{" "}
              <button
                type="button"
                onClick={() => { setStep("email"); setSubmitError(null); clearError() }}
                className="font-bold text-foreground hover:underline"
              >
                Go back
              </button>
            </p>
          </>
        )}

        {/* ── Step 3: New Password ── */}
        {step === "password" && (
          <>
            <header className="pt-20 text-center">
              <h1 className="text-primary">New Password</h1>
              <p className="pt-1.5 text-sm text-foreground/60">
                Choose a strong password for your account
              </p>
            </header>

            {errorBanner}

            <form className="pt-10 space-y-5" onSubmit={handleResetPassword}>
              <LabeledInput
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                rightIcon={showNewPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                onRightIconClick={() => setShowNewPassword((p) => !p)}
                rightIconAriaLabel={showNewPassword ? "Hide password" : "Show password"}
                value={passwordForm.values.new_password}
                onChange={(val) => passwordForm.setValue("new_password", val)}
                onBlur={() => passwordForm.setTouched("new_password", true)}
                error={passwordForm.touched.new_password ? passwordForm.errors.new_password : ""}
              />

              <LabeledInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                rightIcon={showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                onRightIconClick={() => setShowConfirmPassword((p) => !p)}
                rightIconAriaLabel={showConfirmPassword ? "Hide password" : "Show password"}
                value={passwordForm.values.confirm_password}
                onChange={(val) => passwordForm.setValue("confirm_password", val)}
                onBlur={() => passwordForm.setTouched("confirm_password", true)}
                error={passwordForm.touched.confirm_password ? passwordForm.errors.confirm_password : ""}
              />

              <Button
                type="submit"
                className="mt-10! h-14 w-full rounded-2xl font-bold"
                disabled={!passwordForm.values.new_password || !passwordForm.values.confirm_password || isLoading}
              >
                {isLoading ? "Resetting…" : "Reset Password"}
              </Button>
            </form>
          </>
        )}

      </section>
    </main>
  )
}
