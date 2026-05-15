import { useState } from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { LoginForm } from "@/components/auth/login-form"
import { useLogin } from "@/hooks/auth/useLogin"
import { shouldRedirectAuthenticatedGuest } from "@/lib/auth-guard"

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (shouldRedirectAuthenticatedGuest()) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = Route.useNavigate()
  const { login, loadingState, error, clearError } = useLogin()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setSubmitError(null)
    try {
      await login(email, password)
      navigate({ to: "/dashboard" })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please check your credentials."
      setSubmitError(message)
      throw err
    }
  }

  return (
    <LoginForm
      isLoading={loadingState === "loading"}
      error={error}
      submitError={submitError}
      onSubmit={handleSubmit}
      onClearError={() => {
        clearError()
        setSubmitError(null)
      }}
    />
  )
}
