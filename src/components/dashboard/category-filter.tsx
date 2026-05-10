"use client"

import { useState } from "react"

const CATEGORIES = ["All", "Veggies", "Fruit", "Grains", "Dairy", "Oil"]

export function CategoryFilter() {
  const [active, setActive] = useState("All")

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat
              ? "bg-primary text-primary-foreground"
              : "border border-input bg-background text-foreground/70 hover:border-primary/40"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
