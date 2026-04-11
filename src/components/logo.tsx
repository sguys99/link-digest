type LinkDigestLogoProps = {
  size?: number
  className?: string
}

export function LinkDigestLogo({ size = 36, className }: LinkDigestLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="24"
        className="fill-foreground"
      />
      <path
        d="M20 18.5C20 16.567 21.567 15 23.5 15H28.5C30.433 15 32 16.567 32 18.5V18.5C32 20.433 30.433 22 28.5 22H23.5"
        className="stroke-background"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 29.5C28 31.433 26.433 33 24.5 33H19.5C17.567 33 16 31.433 16 29.5V29.5C16 27.567 17.567 26 19.5 26H24.5"
        className="stroke-background"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 26L26 22"
        className="stroke-background"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
