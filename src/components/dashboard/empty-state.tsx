import { Inbox, Globe, Share2 } from 'lucide-react'
import { AddLinkForm } from './add-link-form'

type EmptyStateProps = {
  message?: string
}

export function EmptyState({
  message = '저장된 링크가 없습니다',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <Inbox className="text-muted-foreground size-12" />

      <div className="text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
        <p className="text-muted-foreground/60 mt-1 text-xs">
          아래에서 직접 URL을 입력하거나, 브라우저 공유 기능을 이용해보세요
        </p>
      </div>

      <AddLinkForm variant="empty-state" />

      <div className="flex gap-6 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
            <Globe className="text-muted-foreground size-4" />
          </div>
          <span className="text-muted-foreground text-xs">URL 직접 입력</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
            <Share2 className="text-muted-foreground size-4" />
          </div>
          <span className="text-muted-foreground text-xs">브라우저에서 공유</span>
        </div>
      </div>
    </div>
  )
}
