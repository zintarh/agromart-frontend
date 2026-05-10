import { useEffect, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail"
import { clearTokens } from "@/utils/storage"

export const Route = createFileRoute("/verify-phone")({
  component: VerifyPhonePage,
})

function VerifyPhonePage() {
  const navigate = Route.useNavigate()
  const { verifyEmail, resendVerification, loadingState, error, clearError } = useVerifyEmail()

  const [otpValue, setOtpValue] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(600)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Read email from sessionStorage — never expose it in the URL
  const email = useMemo(() => sessionStorage.getItem("verify_email") || "", [])

  const isLoading = loadingState === "loading"

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timerId)
  }, [secondsLeft])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timerId = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timerId)
  }, [resendCooldown])

  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
  }, [secondsLeft])

  const isOtpComplete = otpValue.length === 6

  const handleVerifyOtp = async () => {
    if (!email) {
      setSubmitError("Session expired. Please register again.")
      return
    }
    if (!isOtpComplete) {
      setSubmitError("Please enter the complete 6-digit code.")
      return
    }

    setSubmitError(null)
    clearError()

    try {
      await verifyEmail(email, otpValue)
      sessionStorage.removeItem("verify_email")
      clearTokens() // verification stores tokens but user must log in explicitly
      navigate({ to: "/login" })
    } catch (err: any) {
      setSubmitError(err?.message || "Verification failed. Please try again.")
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      setSubmitError("Session expired. Please register again.")
      return
    }

    setSubmitError(null)
    clearError()

    try {
      await resendVerification(email)
      setResendCooldown(60)
      setOtpValue("")
      setSecondsLeft(600)
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to resend code. Please try again.")
    }
  }

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {isLoading && <LoadingOverlay />}

      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-foreground">Verify Your Email</h1>
          <p className="pt-1.5 text-sm text-foreground">Enter the 6-digit code sent to</p>
          <p className="pt-3 font-semibold text-foreground break-all">{email || "your email"}</p>
        </header>

        {(submitError || error) && (
          <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{submitError || error}</p>
          </div>
        )}

        <section
          className="pt-10"
          onPasteCapture={(e) => {
            const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
            if (digits.length > 0) {
              e.preventDefault()
              setOtpValue(digits)
            }
          }}
        >
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={setOtpValue}
            containerClassName="w-full justify-center"
          >
            <InputOTPGroup className="w-full justify-center gap-2 rounded-none">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-14 rounded-[12px] border text-[24px]"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </section>

        <section className="pt-12 text-foreground">
          <p className="text-sm">
            Code expires in <span className="font-bold text-primary">{timeDisplay}</span>
          </p>
          <p className="pt-4 text-sm">
            Didn&apos;t receive code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading}
              className="font-semibold text-primary disabled:opacity-50"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
            </button>
          </p>
        </section>

        <Button
          type="button"
          className="mt-10 h-14 w-full rounded-2xl font-bold"
          disabled={!isOtpComplete || isLoading}
          onClick={handleVerifyOtp}
        >
          {isLoading ? "Verifying…" : "Verify Email"}
        </Button>
      </section>
    </main>
  )
}
