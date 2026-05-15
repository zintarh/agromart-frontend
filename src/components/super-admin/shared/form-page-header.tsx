type FormPageHeaderProps = {
  title: string
  description: string
}

export function FormPageHeader({ title, description }: FormPageHeaderProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
