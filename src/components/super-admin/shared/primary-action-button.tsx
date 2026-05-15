import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PrimaryActionButtonProps = {
  label: string
  to?: string
  search?: Record<string, unknown>
  onClick?: () => void
}

const primaryClassName =
  "h-10 gap-1.5 rounded-lg bg-[#2D5A27] px-4 text-sm font-medium text-white hover:bg-[#2D5A27]/90"

export function PrimaryActionButton({
  label,
  to,
  search,
  onClick,
}: PrimaryActionButtonProps) {
  const content = (
    <>
      {label}
      <Plus className="size-4" strokeWidth={2.5} />
    </>
  )

  const className = cn(
    buttonVariants(),
    primaryClassName,
    "inline-flex items-center"
  )

  if (to) {
    return (
      <Link to={to} search={search} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
