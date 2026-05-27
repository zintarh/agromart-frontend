export const categoryQueryKeys = {
  all: ["categories"] as const,
  stats: () => ["categories", "stats"] as const,
  list: (params?: object) => ["categories", "list", params ?? {}] as const,
  options: () => ["categories", "options"] as const,
}
