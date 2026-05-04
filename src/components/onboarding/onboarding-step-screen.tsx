import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OnboardingStepScreenProps = {
  stepNumber: 1 | 2 | 3
  totalSteps?: number
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  pageClassName?: string
  cardStyle?: CSSProperties
}

export function OnboardingStepScreen({
  stepNumber,
  totalSteps = 3,
  imageSrc,
  imageAlt,
  title,
  description,
  onNext,
  onBack,
  onSkip,
  pageClassName,
  cardStyle,
}: OnboardingStepScreenProps) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-svh w-full max-w-xl flex-col bg-background px-4 py-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-primary md:pt-12",
        pageClassName
      )}
    >
      <div className="mt-7 sm:mt-30 flex justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const dotIndex = index + 1
          const active = dotIndex === stepNumber
          return (
            <span
              key={dotIndex}
              className={active ? "h-2 w-8 rounded-full bg-primary" : "size-2 rounded-full bg-primary/25"}
            />
          )
        })}
      </div>

      <div className="relative mt-8 px-1 pt-[40px]">
        <div className="h-56 rounded-[20px] bg-accent" style={cardStyle} />
        <img
          src={imageSrc}
          alt={imageAlt}
          className="pointer-events-none absolute -bottom-16 left-1/2 w-full -translate-x-1/2 object-contain"
        />
      </div>

      <section className="mx-auto mt-22 max-w-sm text-center">
        <h1
          className="text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h1>
        <p className="pt-2 text-primary">{description}</p>
      </section>

      <section className="mt-auto pb-6">
        <div className="flex items-center justify-center gap-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="size-12 rounded-full border-primary bg-transparent p-0 text-xl text-primary hover:bg-primary/5"
            aria-label="Previous step"
          >
            ←
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onNext}
            className="size-12 text-xl rounded-full border-primary bg-transparent p-0  text-primary hover:bg-primary/5"
            aria-label="Next step"
          >
            →
          </Button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="mx-auto text-sm block pt-6 font-medium text-foreground/70"
        >
          Skip
        </button>
      </section>
    </main>
  )
}
