import { LlmSetupBanner } from '@/components/dashboard/llm-setup-banner'
import { LinkCardList } from '@/components/dashboard/link-card-list'

export default function DashboardPage() {
  return (
    <div className="space-y-4 py-4">
      <h1 className="text-lg font-bold">내 링크</h1>
      <LlmSetupBanner />
      <LinkCardList />
    </div>
  )
}
