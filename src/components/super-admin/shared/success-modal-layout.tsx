import { CenteredModal } from "@/components/super-admin/shared/centered-modal"

type SuccessModalLayoutProps = {
  open: boolean
  icon: React.ReactNode
  title: string
  titleClassName?: string
  subtitle: React.ReactNode
  preview: React.ReactNode
  actions: React.ReactNode
  footer?: React.ReactNode
}

export function SuccessModalLayout({
  open,
  icon,
  title,
  titleClassName,
  subtitle,
  preview,
  actions,
  footer,
}: SuccessModalLayoutProps) {
  return (
    <CenteredModal open={open}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-8">{icon}</div>

        <h2
          className={
            titleClassName ??
            "font-heading text-2xl font-bold leading-tight tracking-tight text-foreground"
          }
        >
          {title}
        </h2>

        <div className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </div>

        <div className="mt-8 w-full">{preview}</div>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-4">
          {actions}
        </div>

        {footer ? <div className="mt-8 w-full">{footer}</div> : null}
      </div>
    </CenteredModal>
  )
}
