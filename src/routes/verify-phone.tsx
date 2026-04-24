import { useEffect, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export const Route = createFileRoute("/verify-phone")({
  component: VerifyPhonePage,
})

function VerifyPhonePage() {
  const navigate = Route.useNavigate()
  const [otpValue, setOtpValue] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(299)

  useEffect(() => {
    if (secondsLeft <= 0) {
      return
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [secondsLeft])

  const timeDisplay = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
  }, [secondsLeft])

  const isOtpComplete = otpValue.length === 4

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <section className="mx-auto flex min-h-[92svh] w-full max-w-[430px] flex-col rounded-[44px] bg-background px-4 pt-6 pb-10 text-black">
        <header className="pt-20 text-center">
          <h1 className="text-foreground">Verify Your Phone</h1>
          <p className="pt-[5px] text-sm text-foreground">Enter the 6-digit code sent to</p>
          <p className="pt-3 font-semibold text-foreground">+123 456 7890</p>
        </header>

        <section className="pt-16">
          <InputOTP
            maxLength={4}
            value={otpValue}
            onChange={setOtpValue}
            containerClassName="w-full justify-center"
          >
            <InputOTPGroup className="w-full justify-center gap-10 rounded-none">
              <InputOTPSlot
                index={0}
                className="size-16 rounded-[16px] border text-[32px] first:rounded-[16px] first:border-r last:rounded-[16px]"
              />
              <InputOTPSlot
                index={1}
                className="size-16 rounded-[16px] border text-[32px] first:rounded-[16px] first:border-r last:rounded-[16px]"
              />
              <InputOTPSlot
                index={2}
                className="size-16 rounded-[16px] border text-[32px] first:rounded-[16px] first:border-r last:rounded-[16px]"
              />
              <InputOTPSlot
                index={3}
                className="size-16 rounded-[16px] border text-[32px] first:rounded-[16px] first:border-r last:rounded-[16px]"
              />
            </InputOTPGroup>
          </InputOTP>
        </section>

        <section className="pt-16 text-foreground">
          <p className="text-foreground">
            Code expires in <span className="font-bold text-black text-lg">{timeDisplay}</span>
          </p>
          <p className="pt-4 text-foreground">
            Didn&apos;t receive code ?{" "}
            <button
              type="button"
              onClick={() => setSecondsLeft(299)}
              className="font-semibold text-black"
            >
              <span className="text-black text-lg font-bold">Resend</span>
            </button>
          </p>
        </section>

        <Button
          type="button"
          className="mt-auto h-14 w-full rounded-[16px] font-bold"
          disabled={!isOtpComplete}
          onClick={() => navigate({ to: "/login" })}
        >
          Verify OTP
        </Button>
      </section>
    </main>
  )
}
