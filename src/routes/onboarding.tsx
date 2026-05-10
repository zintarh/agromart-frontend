import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { OnboardingStepScreen } from "@/components/onboarding/onboarding-step-screen"

export const Route = createFileRoute("/onboarding")({
  component: OnboardingFlow,
})

type OnboardingScreen = "step-1" | "step-2" | "step-3"
const HAS_SEEN_ONBOARDING_KEY = "agromart_has_seen_onboarding"

function OnboardingFlow() {
  const navigate = Route.useNavigate()
  const [currentScreen, setCurrentScreen] = useState<OnboardingScreen>("step-1")

  const completeOnboarding = () => {
    window.localStorage.setItem(HAS_SEEN_ONBOARDING_KEY, "true")
    navigate({ to: "/create-account" })
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {currentScreen === "step-1" ? (
        <OnboardingStepScreen
          stepNumber={1}
          imageSrc="/onboarding%20/basket-produce.png"
          imageAlt="Basket of fresh farm produce"
          title="Fresh Farm Produce"
          cardStyle={{ backgroundColor: "#f0c7c7" }}
          description="Get the freshest vegetables, fruits, and grains directly from local farmers"
          onNext={() => setCurrentScreen("step-2")}
          onBack={() => navigate({ to: "/get-started" })}
          onSkip={completeOnboarding}
        />
      ) : null}

      {currentScreen === "step-2" ? (
        <OnboardingStepScreen
          stepNumber={2}
          imageSrc="/onboarding%20/rider.png"
          imageAlt="Fast delivery rider"
          title="Fast Doorstep Delivery"
          description="Same-day and next-day delivery options to your home or business."
          cardStyle={{ backgroundColor: "#bbdcf1" }}
          onNext={() => setCurrentScreen("step-3")}
          onBack={() => setCurrentScreen("step-1")}
          onSkip={completeOnboarding}
        />
      ) : null}

      {currentScreen === "step-3" ? (
        <OnboardingStepScreen
          stepNumber={3}
          imageSrc="/onboarding%20/secure.png"
          imageAlt="Secure and easy payment"
          title="Secure & Easy Payment"
          description="Same-day and next-day delivery options to your home or business."
          cardStyle={{ backgroundColor: "#bfe9c1" }}
          onNext={completeOnboarding}
          onBack={() => setCurrentScreen("step-2")}
          onSkip={completeOnboarding}
        />
      ) : null}
    </div>
  )
}
