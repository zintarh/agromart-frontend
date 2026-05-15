import { Check, Sparkles } from "lucide-react"

const sparklePositions = [
  { className: "-top-2 left-4", size: "size-4" },
  { className: "top-0 -right-2", size: "size-5" },
  { className: "-bottom-2 left-1", size: "size-3.5" },
  { className: "bottom-0 right-2", size: "size-4" },
] as const

export function SuccessBadgeIcon() {
  return (
    <div className="relative mx-auto size-28">
      {sparklePositions.map(({ className, size }, index) => (
        <Sparkles
          key={index}
          className={`absolute ${className} ${size} text-[#4ADE80]`}
          strokeWidth={1.75}
          fill="#4ADE80"
        />
      ))}

      <div className="flex size-28 items-center justify-center rounded-full bg-[#4ADE80] shadow-[0_4px_28px_rgba(74,222,128,0.35)]">
        <Check className="size-12 text-white" strokeWidth={3} />
      </div>
    </div>
  )
}
