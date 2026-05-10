type AppLogoProps = {
  className?: string
  style?: React.CSSProperties
}

export function AppLogo({ className, style }: AppLogoProps) {
  return (
    <p
      className={["font-bold", className].filter(Boolean).join(" ")}
      style={style}
      aria-label="AgroMart"
      role="img"
    >
      AgroMart
    </p>
  )
}
