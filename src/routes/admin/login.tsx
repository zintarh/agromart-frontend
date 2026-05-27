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

  const handleSubmit = async (email: string, password: string) => {
    clearError()
    try {
      await login(email, password)
      const role = useAdminStore.getState().user?.role
      const destination =
        redirectTo && redirectTo.startsWith("/admin") ? redirectTo : getPortalHomePath(role)
      void navigate({ to: destination })
    } catch {
      // Error is already handled in the hook and stored in state
    }
  }

  return (
    <LoginForm
      title="Welcome Back"
      subtitle="Log in to the AgroMart admin portal"
      isLoading={loadingState === "loading"}
      error={error}
      submitError={null}
      onSubmit={handleSubmit}
      onClearError={clearError}
      showSocialAuth={false}
      showSignUpLink={false}
    />
  )
}
