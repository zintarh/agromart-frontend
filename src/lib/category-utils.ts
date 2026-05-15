export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export function formatCategoryDate(isoDate?: string | null): string {
  if (!isoDate) return "0"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "0"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
