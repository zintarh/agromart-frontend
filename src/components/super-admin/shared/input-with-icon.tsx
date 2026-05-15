import type { LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  icon: LucideIcon
}

export function InputWithIcon({
  icon: Icon,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-10 border-border bg-white pl-9", className)} {...props} />
    </div>
  )
}
