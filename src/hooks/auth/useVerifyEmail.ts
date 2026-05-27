import { useMutation } from "@tanstack/react-query"

import { authService } from "@/services/auth"
import { useSessionStore } from "@/store/sessionStore"

export function useVerifyEmail() {
  const setSession = useSessionStore((state) => state.setSession)

  const {
    mutateAsync: verifyEmail,
    isPending: isVerifyPending,
    error: verifyError,
    reset: resetVerify,
  } = useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      authService.verifyEmail(email, token),
    onSuccess: (response) => {
      setSession(response.data?.user || null)
    },
  })

  const {
    mutateAsync: resendVerification,
    isPending: isResendPending,
    error: resendError,
    reset: resetResend,
  } = useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  })

  const isPending = isVerifyPending || isResendPending
  const rawError = verifyError ?? resendError
  const error = rawError instanceof Error
    ? rawError.message
    : rawError ? "Verification failed. Please try again." : null

  const doVerifyEmail = (email: string, token: string) => verifyEmail({ email, token })

  return {
    verifyEmail: doVerifyEmail,
    resendVerification,
    loadingState: isPending ? ("loading" as const) : ("idle" as const),
    error,
    clearError: () => { resetVerify(); resetResend() },
  }
}
