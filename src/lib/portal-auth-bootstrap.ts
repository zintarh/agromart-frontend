import { isClient } from "@/lib/auth-guard"
import { syncPortalSessionFromStorage } from "@/lib/portal-session-sync"

let bootstrapped = false

/** True after the first client-side portal auth sync this page load. */
export function isPortalAuthBootstrapped(): boolean {
  return bootstrapped
}

/**
 * Sync localStorage → Zustand once before guards or API interceptors run.
 * Safe to call multiple times.
 */
export function bootstrapPortalAuth(): void {
  if (!isClient) return
  syncPortalSessionFromStorage()
  bootstrapped = true
}

export function resetPortalAuthBootstrap(): void {
  bootstrapped = false
}
