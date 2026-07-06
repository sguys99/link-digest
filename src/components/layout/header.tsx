import Link from 'next/link'

/**
 * 헤더의 정적 껍데기. 우측 사용자 메뉴 슬롯은 children으로 받아
 * <Suspense>로 감싼 프로필 조회를 흘려보낼 수 있게 한다(레이아웃 블로킹 방지).
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          LinkDigest
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/announcements"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            공지사항
          </Link>
          {children}
        </div>
      </div>
    </header>
  )
}
