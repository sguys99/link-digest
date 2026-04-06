import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user!.id)
    .single()

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-2xl font-bold">
        환영합니다, {profile?.display_name ?? user!.email}님
      </h1>
      <p className="text-muted-foreground">
        Phase 2에서 링크 목록이 여기에 표시됩니다.
      </p>
    </div>
  )
}
