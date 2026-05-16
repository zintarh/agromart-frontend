import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { LoginForm } from "@/components/auth/login-form"
import { usePortalLogin } from "@/hooks/auth/usePortalLogin"
import { getPortalHomePath } from "@/lib/portal-roles"
import { useAdminStore } from "@/store/adminStore"

const portalLoginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/admin/login")({
  validateSearch: portalLoginSearchSchema,
  component: PortalLoginPage,
})

function PortalLoginPage() {
  const navigate = Route.useNavigate()
  const { redirect: redirectTo } = Route.useSearch()
  const { login, loadingState, error, clearError } = usePortalLogin()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (email: string, password: string) => {
    setSubmitError(null)
    try {
      await login(email, password)
      const role = useAdminStore.getState().user?.role
      const destination =
        redirectTo && redirectTo.startsWith("/admin") ? redirectTo : getPortalHomePath(role)
      void navigate({ to: destination })
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
      subtitle="Log in to the AgroMart admin portal"
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
