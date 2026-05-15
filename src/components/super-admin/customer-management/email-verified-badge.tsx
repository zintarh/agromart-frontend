import { cn } from "@/lib/utils"

type EmailVerifiedBadgeProps = {
  verified: boolean
}

export function EmailVerifiedBadge({ verified }: EmailVerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        verified
          ? "bg-[#E8F5E9] text-[#2D5A27]"
          : "bg-[#F5F5F5] text-muted-foreground"
      )}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  )
}
