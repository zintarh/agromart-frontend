import { useState } from "react"

type SocialAuthButtonsProps = {
  mode: "login" | "signup"
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api-agromart.thebuidl.xyz"

const SOCIAL_PROVIDERS = {
  google: import.meta.env.VITE_AUTH_GOOGLE_URL || `${API_BASE_URL}/auth/google`,
  facebook: import.meta.env.VITE_AUTH_FACEBOOK_URL || `${API_BASE_URL}/auth/facebook`,
  apple: import.meta.env.VITE_AUTH_APPLE_URL || `${API_BASE_URL}/auth/apple`,
} as const

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const [socialError, setSocialError] = useState<string | null>(null)

  const handleSocialAuth = (provider: keyof typeof SOCIAL_PROVIDERS) => {
    setSocialError(null)
    const providerUrl = SOCIAL_PROVIDERS[provider]
    if (!providerUrl) {
      setSocialError(`${provider} login is not configured yet.`)
      return
    }
    window.location.assign(providerUrl)
  }

  const cta = mode === "signup" ? "continue with" : "continue with"

  return (
    <section className="pt-3">
      <p className="text-center text-sm text-foreground/70">or {cta}</p>
      <div className="flex items-center justify-center gap-4 pt-3">
        <button type="button" onClick={() => handleSocialAuth("google")} aria-label="Continue with Google">
          <img src="/onboarding%20/google.png" alt="Continue with Google" className="size-8 object-contain" />
        </button>
        <button type="button" onClick={() => handleSocialAuth("facebook")} aria-label="Continue with Facebook">
          <img src="/onboarding%20/facebook.png" alt="Continue with Facebook" className="size-8 object-contain" />
        </button>
        <button type="button" onClick={() => handleSocialAuth("apple")} aria-label="Continue with Apple">
          <img src="/onboarding%20/mac.png" alt="Continue with Apple" className="size-8 object-contain" />
        </button>
      </div>
      {socialError ? <p className="pt-3 text-center text-sm text-destructive">{socialError}</p> : null}
    </section>
  )
}
