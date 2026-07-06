import Link from 'next/link'
import { LinkDigestLogo } from '@/components/logo'

/**
 * 비인증 공용 헤더 — 공지 등 (auth) 그룹 밖 공개 페이지에서 사용한다.
 * 인증 여부에 따라 우측 링크만 대시보드/홈으로 분기한다.
 * frosted glass 문법으로 인증 셸(header.tsx)·랜딩과 룩을 통일.
 */
export function SiteHeader({ authed }: { authed: boolean }) {
  const target = authed ? '/dashboard' : '/'
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link href={target} className="flex items-center gap-2">
          <LinkDigestLogo size={24} />
          <span className="text-lg font-semibold tracking-tight">LinkDigest</span>
        </Link>
        <Link
          href={target}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {authed ? '대시보드' : '홈'}
        </Link>
      </div>
    </header>
  )
}
