/** Formats compare-at price + unit for product preview cards in success modals. */
export function formatProductPreviewPrice(
  compareAtPrice: string | undefined,
  unit: string
): string {
  if (!compareAtPrice?.trim()) return `Per ${unit}`
  const amount = Number.parseFloat(compareAtPrice)
  if (!Number.isFinite(amount)) return `Per ${unit}`
  return (
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount) + ` / ${unit}`
  )
}
