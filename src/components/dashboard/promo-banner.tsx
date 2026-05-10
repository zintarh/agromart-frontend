"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

const BANNERS = [
  {
    id: 1,
    title: "Farm-Fresh Produce",
    subtitle: "20% Off Today Only",
  },
  {
    id: 2,
    title: "Organic Fruits",
    subtitle: "Farm fresh daily delivery",
  },
  {
    id: 3,
    title: "Grains & Staples",
    subtitle: "Best quality, lowest prices",
  },
]

export function PromoBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const banner = BANNERS[current]

  return (
    <div className="space-y-2.5">
      <div className="relative h-29.5 w-full overflow-hidden rounded-2xl bg-linear-to-r from-[#2b5219] to-[#4a7a35]">
        {/* Decorative circles */}
        <span className="pointer-events-none absolute -right-6 top-1/2 size-27 -translate-y-1/2 rounded-full border-20 border-white/15" />
        <span className="pointer-events-none absolute right-5 top-1/2 size-14 translate-y-[-30%] rounded-full bg-white/10" />

        <div className="flex h-full flex-col justify-center px-5">
          {/* Tag */}
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#f0ead8] px-2.5 py-1">
            <Zap className="size-3 fill-primary text-primary" />
            <span className="text-[10px] font-semibold text-primary">Fresh Sales</span>
          </div>

          {/* Texts — 12px gap from tag */}
          <div className="mt-3">
            <h3 className="text-[22px] font-bold leading-tight text-white">{banner.title}</h3>
            <p className="mt-0.5 text-sm text-white/85">{banner.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Dot indicators — below the card */}
      <div className="flex justify-center gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Banner ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-4 bg-primary" : "w-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
