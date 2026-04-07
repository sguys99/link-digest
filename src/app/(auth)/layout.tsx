import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { QueryProvider } from '@/components/providers/query-provider'
import { PwaInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import { OfflineBanner } from '@/components/pwa/offline-banner'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // public.users에서 프로필 조회
  const { data: profile } = await supabase
    .from('users')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <QueryProvider>
      <OfflineBanner />
      <Header
        email={user.email ?? ''}
        displayName={profile?.display_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="mx-auto max-w-screen-sm px-4 pt-14 pb-16">
        {children}
      </main>
      <BottomNav />
      <PwaInstallPrompt />
    </QueryProvider>
  )
}
