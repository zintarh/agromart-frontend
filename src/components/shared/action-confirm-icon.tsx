import { ErrorDeleteModalIcon } from "@/components/shared/modal-illustration-icon"

export type ActionConfirmIconVariant = "danger" | "warning"

type ActionConfirmIconProps = {
  variant?: ActionConfirmIconVariant
  /** @deprecated Illustration is fixed; kept for call-site compatibility. */
  glyph?: "delete" | "alert" | "warning"
  className?: string
}

/** Delete / cancel confirmation illustration (`/error-delete.png`). */
export function ActionConfirmIcon({ className }: ActionConfirmIconProps) {
  return <ErrorDeleteModalIcon className={className} />
}
