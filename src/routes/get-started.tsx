import { createFileRoute } from "@tanstack/react-router"
import { OnboardingGetStartedScreen } from "@/components/onboarding/onboarding-get-started-screen"

export const Route = createFileRoute("/get-started")({
  component: GetStartedPage,
})

const HAS_SEEN_ONBOARDING_KEY = "agromart_has_seen_onboarding"

function GetStartedPage() {
  const navigate = Route.useNavigate()

  return (
    <OnboardingGetStartedScreen
      onStart={() => {
        const hasSeenOnboarding = window.localStorage.getItem(HAS_SEEN_ONBOARDING_KEY) === "true"
        if (hasSeenOnboarding) {
          navigate({ to: "/create-account" })
          return
        }
        navigate({ to: "/onboarding" })
      }}
      onBack={() => navigate({ to: "/login" })}
    />
  )
}
