import { useMutation } from "@tanstack/react-query"

import { authService } from "@/services/auth"

export function useForgotPassword() {
  const {
    mutateAsync: forgotPassword,
    isPending: isForgotPending,
    error: forgotError,
    reset: resetForgot,
  } = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  })

  const {
    mutateAsync: resetPassword,
    isPending: isResetPending,
    error: resetError,
    reset: resetReset,
  } = useMutation({
    mutationFn: ({ email, token, newPassword }: { email: string; token: string; newPassword: string }) =>
      authService.resetPassword(email, token, newPassword),
  })

  const isPending = isForgotPending || isResetPending
  const rawError = forgotError ?? resetError
  const error = rawError instanceof Error
    ? rawError.message
    : rawError ? "Request failed. Please try again." : null

  const doResetPassword = (email: string, token: string, newPassword: string) =>
    resetPassword({ email, token, newPassword })

  return {
    forgotPassword,
    resetPassword: doResetPassword,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: () => { resetForgot(); resetReset() },
  }
}
