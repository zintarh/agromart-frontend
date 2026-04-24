import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"

type LabeledInputProps = {
  label: string
  placeholder: string
  type?: string
  icon?: ReactNode
  rightIcon?: ReactNode
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  onRightIconClick?: () => void
  rightIconAriaLabel?: string
}

export function LabeledInput({
  label,
  placeholder,
  type = "text",
  icon,
  rightIcon,
  value,
  onChange,
  onBlur,
  error,
  onRightIconClick,
  rightIconAriaLabel,
}: LabeledInputProps) {
  return (
    <label className="block">
      <span
        className="block pb-2 text-[14px] text-foreground/80"
        style={{ fontFamily: "var(--font-label)" }}
      >
        {label}
      </span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-foreground/60">
            {icon}
          </span>
        ) : null}
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`rounded-[16px] bg-transparent placeholder:text-sm text-sm ${error ? "h-16 border-2 border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : "h-14 border-input"} ${icon ? "pl-10" : "pl-3"} ${rightIcon ? "pr-11" : "pr-3"}`}
        />
        {error ? (
          <span className="pointer-events-none absolute bottom-1 left-3 text-[10px] text-destructive">
            {error}
          </span>
        ) : null}
        {rightIcon ? (
          onRightIconClick ? (
            <button
              type="button"
              onClick={onRightIconClick}
              aria-label={rightIconAriaLabel ?? "Toggle input visibility"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-foreground/70"
            >
              {rightIcon}
            </button>
          ) : (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-foreground/70">
              {rightIcon}
            </span>
          )
        ) : null}
      </span>
    </label>
  )
}
