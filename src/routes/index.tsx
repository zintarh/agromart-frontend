import { createFileRoute } from "@tanstack/react-router"
import { OnboardingSplashScreen } from "@/components/onboarding/onboarding-splash-screen"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const navigate = Route.useNavigate()

  return <OnboardingSplashScreen onContinue={() => navigate({ to: "/get-started", replace: true })} />
}
