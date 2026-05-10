import { Button } from "@/components/ui/button"

type OnboardingScreenShellProps = {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  onCta: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function OnboardingScreenShell({
  eyebrow,
  title,
  description,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
}: OnboardingScreenShellProps) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-8 px-6 py-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] md:rounded-2xl md:border md:border-border md:shadow-sm">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h1 className="font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </section>

      <section className="space-y-3">
        <Button className="h-11 w-full" onClick={onCta}>
          {ctaLabel}
        </Button>

        {secondaryLabel && onSecondary ? (
          <Button
            variant="ghost"
            className="h-11 w-full"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </section>
    </main>
  )
}
