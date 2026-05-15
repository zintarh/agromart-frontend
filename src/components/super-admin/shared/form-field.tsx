import { cn } from "@/lib/utils"

type FormFieldProps = {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  )
}
