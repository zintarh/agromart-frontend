type CustomerAvatarProps = {
  initials: string
  color: string
}

export function CustomerAvatar({ initials, color }: CustomerAvatarProps) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#1a1a1a]"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}
