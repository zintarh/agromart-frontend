import { useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Check, Circle, Eye, EyeOff, Mail, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LabeledInput } from "@/components/auth/labeled-input"

export const Route = createFileRoute("/create-account")({
  component: CreateAccountPage,
})

function CreateAccountPage() {
  const navigate = Route.useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  })

  const passwordChecks = useMemo(
    () => ({
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialCharacter: /[^A-Za-z0-9]/.test(password),
      hasMinLength: password.length >= 6,
    }),
    [password]
  )

  const isFormValid = useMemo(() => {
    const isFullNameValid = fullName.trim().length > 1
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isPhoneValid = phoneNumber.replace(/\D/g, "").length >= 10
    const isPasswordValid = Object.values(passwordChecks).every(Boolean)
    const isConfirmPasswordValid = confirmPassword.length > 0 && confirmPassword === password

    return (
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      agreedToTerms
    )
  }, [agreedToTerms, confirmPassword, email, fullName, password, passwordChecks, phoneNumber])

  const fieldErrors = useMemo(() => {
    const fullNameError = fullName.trim().length > 1 ? "" : "Enter full name"
    const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter valid email"
    const phoneError = phoneNumber.replace(/\D/g, "").length >= 10 ? "" : "Enter valid phone"
    const passwordError = Object.values(passwordChecks).every(Boolean) ? "" : "Password not valid"
    const confirmPasswordError =
      confirmPassword.length > 0 && confirmPassword === password ? "" : "Passwords must match"

    return {
      fullName: fullNameError,
      email: emailError,
      phoneNumber: phoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    }
  }, [confirmPassword, email, fullName, password, passwordChecks, phoneNumber])

  const showError = (field: keyof typeof touched) => touched[field] && !!fieldErrors[field]

  return (
    <main className="min-h-svh bg-background px-2 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <section className="mx-auto w-full max-w-xl rounded-[44px] bg-background px-4 pt-6 pb-10 text-foreground">
        <header className="pt-20 text-center">
          <h1 className="text-primary">Create Account</h1>
          <p className="pt-[5px] text-sm text-primary">Join us for fresh produce</p>
        </header>

        <form
          className="pt-8"
          onSubmit={(event) => {
            event.preventDefault()
            if (isFormValid) {
              navigate({ to: "/verify-phone" })
            }
          }}
        >
          <div className="space-y-5">
            <LabeledInput
              label="Full Name"
              placeholder="Ajadi Abdulmalik"
              icon={<User className="size-4" />}
              value={fullName}
              onChange={setFullName}
              onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              error={showError("fullName") ? fieldErrors.fullName : ""}
            />
            <LabeledInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="size-4" />}
              value={email}
              onChange={setEmail}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              error={showError("email") ? fieldErrors.email : ""}
            />
            <LabeledInput
              label="Phone Number"
              type="tel"
              placeholder="08167042797"
              icon={<Phone className="size-4" />}
              value={phoneNumber}
              onChange={setPhoneNumber}
              onBlur={() => setTouched((prev) => ({ ...prev, phoneNumber: true }))}
              error={showError("phoneNumber") ? fieldErrors.phoneNumber : ""}
            />
            <LabeledInput
              label="Create Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              rightIcon={showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              rightIconAriaLabel={showPassword ? "Hide password" : "Show password"}
              value={password}
              onChange={setPassword}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              error={showError("password") ? fieldErrors.password : ""}
            />
            {password.length > 0 ? (
              <PasswordChecklist
                checks={[
                  { label: "1 uppercase", met: passwordChecks.hasUppercase },
                  { label: "1 lowercase", met: passwordChecks.hasLowercase },
                  { label: "1 number", met: passwordChecks.hasNumber },
                  { label: "minimum of 6 characters", met: passwordChecks.hasMinLength },
                  { label: "1 special character", met: passwordChecks.hasSpecialCharacter },
                ]}
              />
            ) : null}
            <LabeledInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confrim Password"
              rightIcon={showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
              rightIconAriaLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
              error={showError("confirmPassword") ? fieldErrors.confirmPassword : ""}
            />
          </div>

          <label className="flex text-[12px] items-center gap-3 pt-5 text-foreground/80">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
              className="size-5 rounded-sm border border-input accent-primary"
            />
            <span>
              I agree to the <span className="font-semibold  text-foreground">Terms &amp; Condition</span>
            </span>
          </label>

          <Button
            type="submit"
            className="mt-8 h-14 w-full rounded-[16px] font-bold"
            disabled={!isFormValid}
          >
            Sign Up
          </Button>

          <p className="pt-7 text-center text-sm text-foreground/90">
            Already have an account ?{" "}
            <Link to="/login" className="font-bold text-foreground">
              Login
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

type PasswordRule = {
  label: string
  met: boolean
}

function PasswordChecklist({ checks }: { checks: PasswordRule[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-[16px] border border-input p-4 text-[10px]">
      {checks.map((check) => (
        <p
          key={check.label}
          className={check.met ? " text-[10px] flex items-center gap-2 text-primary" : "text-[10px] flex items-center gap-2 text-destructive"}
        >
          {check.met ? <Check className="size-4" /> : <Circle className="size-4" />}
          {check.label}
        </p>
      ))}
    </div>
  )
}
