import { useEffect } from "react"
import { AppLogo } from "@/components/brand/app-logo"

type OnboardingSplashScreenProps = {
  onContinue: () => void
}

export function OnboardingSplashScreen({
  onContinue,
}: OnboardingSplashScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onContinue()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [onContinue])

  return (
    <main className="mx-auto flex min-h-svh w-full  flex-col bg-primary text-primary-foreground">
      <div className="relative mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-[40px] bg-primary text-primary-foreground">
        <AppLogo
          className="animate-pulse text-5xl font-extrabold tracking-tight text-primary-foreground"
          style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.35)" }}
        />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[64%] max-w-[260px]">
          <img
            src="/onboarding%20/splash.png"
            alt=""
            aria-hidden="true"
            className="block w-full object-contain"
          />
        </div>
      </div>
    </main>
  )
}
