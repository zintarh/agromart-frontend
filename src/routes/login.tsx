import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Eye, EyeOff, Mail } from "lucide-react"
import { LabeledInput } from "@/components/auth/labeled-input"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isFormValid = email.trim().length > 0 && password.trim().length > 0

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-primary">Welcome Back</h1>
          <p className="pt-[5px] text-sm text-primary">Log in to your account</p>
        </header>

        <form
          className="pt-8"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <div className="space-y-6">
            <LabeledInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="size-4" />}
              value={email}
              onChange={setEmail}
            />
            <LabeledInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              rightIcon={showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              rightIconAriaLabel={showPassword ? "Hide password" : "Show password"}
              value={password}
              onChange={setPassword}
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <label className="flex items-center gap-3 text-[12px] text-foreground/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-5 rounded-sm border border-input accent-primary"
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="text-[12px] font-semibold text-foreground">
              Forget Password ?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-[16px] font-bold"
            disabled={!isFormValid}
          >
            Log In
          </Button>

          <p className="pt-7 text-center text-sm text-foreground/90">
            Don&apos;t have an account ?{" "}
            <Link to="/create-account" className="font-bold text-foreground">
              Sign Up
            </Link>
          </p>

          <p className="pt-3 text-center text-sm text-foreground/70">or continue with</p>

          <div className="flex items-center justify-center gap-4 pt-3">
            <img src="/onboarding%20/google.png" alt="Continue with Google" className="size-8 object-contain" />
            <img src="/onboarding%20/facebook.png" alt="Continue with Facebook" className="size-8 object-contain" />
            <img src="/onboarding%20/mac.png" alt="Continue with Apple" className="size-8 object-contain" />
          </div>
        </form>
      </section>
    </main>
  )
}

