import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Mail } from "lucide-react"
import { LabeledInput } from "@/components/auth/labeled-input"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-primary">Reset Password</h1>
          <p className="pt-[5px] text-sm text-primary">Enter your email to receive reset link</p>
        </header>

        <form
          className="pt-14"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <LabeledInput
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="johndeo@gmail.com"
            icon={<Mail className="size-4" />}
          />

          <Button
            type="submit"
            className="mt-28 h-14 w-full rounded-[16px] font-bold"
            disabled={!isEmailValid}
          >
            Send Reset Link
          </Button>
        </form>
 
        <p className="pt-16 text-center text-sm text-foreground/90">
          Remember password ?{" "}
          <Link to="/login" className="font-bold text-black ">
            Back to Login
          </Link>
        </p>
      </section>
    </main>
  )
}
