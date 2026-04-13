import { LlmSetupBanner } from '@/components/dashboard/llm-setup-banner'
import { LinkCardList } from '@/components/dashboard/link-card-list'
import { AddLinkForm } from '@/components/dashboard/add-link-form'
import { AddLinkFab } from '@/components/dashboard/add-link-fab'

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-lg font-bold">내 링크</h1>
      <LlmSetupBanner />
      <AddLinkForm variant="inline" />
      <LinkCardList />
      <AddLinkFab />
    </div>
  )
}
