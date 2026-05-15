import { ContentPanelCard } from "@/components/super-admin/shared/content-panel-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminActionsCard() {
  return (
    <ContentPanelCard title="Admin Actions">
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-lg border-red-200 bg-white text-sm font-medium text-red-600 shadow-none hover:bg-white"
        >
          Reset Password
        </Button>
        <Button
          type="button"
          className="h-11 w-full rounded-lg bg-[#2D5A27] text-sm font-medium text-white hover:bg-[#2D5A27]/90"
        >
          Send Promo Code
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 w-full rounded-lg border-red-200 bg-red-50 text-sm font-medium text-red-600 shadow-none hover:bg-red-50"
          )}
        >
          Suspend Account
        </Button>
      </div>
    </ContentPanelCard>
  )
}
