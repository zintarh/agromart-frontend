import { createFileRoute } from "@tanstack/react-router"
import { OnboardingGetStartedScreen } from "@/components/onboarding/onboarding-get-started-screen"
import { OnboardingSplashScreen } from "@/components/onboarding/onboarding-splash-screen"
import { OnboardingStepScreen } from "@/components/onboarding/onboarding-step-screen"

export const Route = createFileRoute("/onboarding")({
  component: OnboardingFlow,
})

type OnboardingScreen = "splash" | "get-started" | "step-1" | "step-2" | "step-3"

function OnboardingFlow() {
  const navigate = Route.useNavigate()
  const { screen } = Route.useSearch() as { screen?: OnboardingScreen }
  const currentScreen = screen ?? "splash"

  const setCurrentScreen = (nextScreen: OnboardingScreen) => {
    navigate({
      search: (prev) => ({
        ...prev,
        screen: nextScreen,
      }),
      replace: true,
    })
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {currentScreen === "splash" ? (
        <OnboardingSplashScreen onContinue={() => setCurrentScreen("get-started")} />
      ) : null}

      {currentScreen === "get-started" ? (
        <OnboardingGetStartedScreen
          onStart={() => setCurrentScreen("step-1")}
          onBack={() => navigate({ to: "/login" })}
        />
      ) : null}

      {currentScreen === "step-1" ? (
        <OnboardingStepScreen
          stepNumber={1}
          imageSrc="/onboarding%20/basket-produce.png"
          imageAlt="Basket of fresh farm produce"
          title="Fresh Farm Produce"
          cardStyle={{ backgroundColor: "#f0c7c7" }}
          description="Get the freshest vegetables, fruits, and grains directly from local farmers"
          onNext={() => setCurrentScreen("step-2")}
          onBack={() => setCurrentScreen("get-started")}
          onSkip={() => setCurrentScreen("step-3")}
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
          onSkip={() => setCurrentScreen("step-3")}
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
          onNext={() => navigate({ to: "/create-account" })}
          onBack={() => setCurrentScreen("step-2")}
          onSkip={() => setCurrentScreen("splash")}
        />
      ) : null}
    </div>
  )
}
