import { MODAL_ERROR_DELETE_ICON_SRC, MODAL_SUCCESS_ICON_SRC } from "@/lib/modal-assets"
import { cn } from "@/lib/utils"

type ModalIllustrationIconProps = {
  src: string
  alt?: string
  className?: string
}

const illustrationClass = "mx-auto h-auto w-[7rem] max-w-[min(7rem,40vw)] object-contain"

export function ModalIllustrationIcon({
  src,
  alt = "",
  className,
}: ModalIllustrationIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={112}
      height={112}
      draggable={false}
      aria-hidden={alt === ""}
      className={cn(illustrationClass, className)}
    />
  )
}

export function SuccessModalIcon({ className }: { className?: string }) {
  return (
    <ModalIllustrationIcon
      src={MODAL_SUCCESS_ICON_SRC}
      className={className}
    />
  )
}

export function ErrorDeleteModalIcon({ className }: { className?: string }) {
  return (
    <ModalIllustrationIcon
      src={MODAL_ERROR_DELETE_ICON_SRC}
      className={className}
    />
  )
}
