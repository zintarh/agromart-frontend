export function PortalRouteLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#F5F5F5]">
      <div
        className="size-8 animate-spin rounded-full border-2 border-[#2D6A4F] border-t-transparent"
        aria-label="Loading"
        role="status"
      />
    </div>
  )
}
