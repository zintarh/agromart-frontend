import { AppLogo } from "@/components/brand/app-logo"
import { Button } from "@/components/ui/button"

type OnboardingGetStartedScreenProps = {
  onStart: () => void
  onBack: () => void
}

export function OnboardingGetStartedScreen({
  onStart,
  onBack,
}: OnboardingGetStartedScreenProps) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col bg-background px-4 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-primary">
      <div className="mt-[98px] flex justify-center">
        <AppLogo className="font-bold tracking-tight text-2xl text-primary" />
      </div>

      <section className="mt-[89px] text-center text-primary">
        <h1
        >
          AGRO FARM MARKETPLACE
        </h1>
        <p className="pt-1 text-primary/90">
          Fresh from farm to table
        </p>
      </section>

      <section className="mt-[190px] space-y-[22px]">
        <Button
          className="h-16 w-full rounded-[16px] font-bold text-primary-foreground"
          onClick={onStart}
        >
          Get Started
        </Button>
        <Button
          variant="outline"
          className="h-16 w-full rounded-[16px] border-primary/60 bg-transparent font-bold text-primary hover:bg-primary/5"
          onClick={onBack}
        >
          I Already Have an Account
        </Button>
      </section>
    </main>
  )
}
