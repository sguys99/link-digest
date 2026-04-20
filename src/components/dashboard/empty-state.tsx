import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  message?: string
}

export function EmptyState({
  message = '저장된 링크가 없습니다',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <Inbox className="text-muted-foreground size-12" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
