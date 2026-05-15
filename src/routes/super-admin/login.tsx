import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { LoginForm } from "@/components/auth/login-form"
import { useSuperAdminLogin } from "@/hooks/auth/useSuperAdminLogin"

const superAdminLoginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/super-admin/login")({
  validateSearch: superAdminLoginSearchSchema,
  component: SuperAdminLoginPage,
})

function SuperAdminLoginPage() {
  const navigate = Route.useNavigate()
  const { redirect: redirectTo } = Route.useSearch()
  const { login, loadingState, error, clearError } = useSuperAdminLogin()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setSubmitError(null)
    try {
      await login(email, password)
      const destination =
        redirectTo && redirectTo.startsWith("/super-admin") ? redirectTo : "/super-admin/dashboard"
      navigate({ to: destination })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please check your credentials."
      setSubmitError(message)
      throw err
    }
  }

  return (
    <LoginForm
      title="Welcome Back"
      subtitle="Log in to the super admin portal"
      isLoading={loadingState === "loading"}
      error={error}
      submitError={submitError}
      onSubmit={handleSubmit}
      onClearError={() => {
        clearError()
        setSubmitError(null)
      }}
      showSocialAuth={false}
      showSignUpLink={false}
    />
  )
}
