const RINGS = [
  { size: "size-24", color: "border-t-green-400", duration: "1200ms", direction: "normal" as const },
  { size: "size-16", color: "border-t-yellow-400", duration: "850ms", direction: "reverse" as const },
  { size: "size-9",  color: "border-t-emerald-500", duration: "550ms", direction: "normal" as const },
]

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-sm">
      <div className="relative flex size-24 items-center justify-center">
        {RINGS.map(({ size, color, duration, direction }) => (
          <span
            key={duration}
            className={`absolute ${size} rounded-full border-4 border-transparent ${color} animate-spin`}
            style={{ animationDuration: duration, animationDirection: direction }}
          />
        ))}
      </div>
    </div>
  )
}
