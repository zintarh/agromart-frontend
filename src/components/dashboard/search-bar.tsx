import { Search, SlidersHorizontal } from "lucide-react"

export function SearchBar() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-input bg-background px-4 py-3">
      <Search className="size-4 shrink-0 text-foreground/50" />
      <input
        type="text"
        placeholder="Search fresh farm produce"
        className="flex-1 bg-transparent text-sm placeholder:text-foreground/50 focus:outline-none"
      />
      <SlidersHorizontal className="size-4 shrink-0 text-foreground/50" />
    </div>
  )
}
