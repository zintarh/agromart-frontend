import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"

type AddUserFooterActionsProps = {
  onCancel: () => void
}

export function AddUserFooterActions({ onCancel }: AddUserFooterActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="h-10 px-4 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="h-10 gap-2 rounded-lg bg-[#2D5A27] px-5 text-sm font-medium text-white hover:bg-[#2D5A27]/90"
      >
        <Save className="size-4" strokeWidth={2} />
        Save User
      </Button>
    </div>
  )
}
