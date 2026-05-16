/**
 * Dev-only helper to inspect the current auth user in the console.
 */
export function logAuthUser(label: string, user: unknown): void {
  if (!import.meta.env.DEV) return

  if (user == null) {
    console.log(`[Auth] ${label}: (no user)`)
    return
  }

  console.log(`[Auth] ${label}:`, user)
}
