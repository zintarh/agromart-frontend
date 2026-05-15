type ComingSoonProps = {
  message?: string
}

export function ComingSoon({ message = "Coming soon" }: ComingSoonProps) {
  return (
    <div className="flex min-h-[min(480px,60vh)] flex-col items-center justify-center rounded-2xl border border-[#E8E8E8] bg-white px-6 py-16 text-center">
      <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {message}
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This section is not available yet. Check back later.
      </p>
    </div>
  )
}
