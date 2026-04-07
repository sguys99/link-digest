import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  message?: string
}

export function EmptyState({
  message = '저장된 링크가 없습니다',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Inbox className="text-muted-foreground size-12" />
      <div className="text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
        <p className="text-muted-foreground/60 mt-1 text-xs">
          공유 기능이나 브라우저에서 링크를 저장해보세요
        </p>
      </div>
    </div>
  )
}
