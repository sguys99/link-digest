import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getAuthClaims } from '@/lib/auth/dal'
import { HeaderShell } from '@/components/layout/header'
import { HeaderProfile } from '@/components/layout/header-profile'
import { UserMenuSkeleton } from '@/components/auth/user-menu'
import { BottomNav } from '@/components/layout/bottom-nav'
import { PwaInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import { OfflineBanner } from '@/components/pwa/offline-banner'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 가벼운 인증 가드만 상단에서 await. 프로필 DB 조회는 HeaderProfile로 분리해
  // Suspense로 스트리밍하므로 children(페이지) 렌더를 블로킹하지 않는다.
  const claims = await getAuthClaims()
  if (!claims) {
    redirect('/')
  }

  return (
    <>
      <OfflineBanner />
      <HeaderShell>
        <Suspense fallback={<UserMenuSkeleton />}>
          <HeaderProfile />
        </Suspense>
      </HeaderShell>
      <main className="mx-auto max-w-screen-sm px-4 pt-14 pb-16">
        {children}
      </main>
      <BottomNav />
      <PwaInstallPrompt />
    </>
  )
}
