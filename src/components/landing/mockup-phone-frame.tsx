type MockupPhoneFrameProps = {
  children: React.ReactNode
  className?: string
}

export function MockupPhoneFrame({ children, className = '' }: MockupPhoneFrameProps) {
  return (
    <div
      className={`relative mx-auto w-[260px] rounded-[2.5rem] border-2 border-foreground/15 bg-background p-3 shadow-2xl ${className}`}
    >
      {/* 노치 */}
      <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-foreground/10" />

      {/* 콘텐츠 영역 */}
      <div className="space-y-2 overflow-hidden rounded-2xl">
        {/* 미니 헤더 */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold tracking-tight">LinkDigest</span>
          <div className="h-5 w-5 rounded-full bg-muted" />
        </div>

        {/* 카드 영역 */}
        <div className="relative">
          {children}
          {/* 하단 페이드 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </div>
  )
}
