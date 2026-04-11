'use client'

import { MoreVertical, Eye, EyeOff, Trash2 } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Link } from '@/types'

type LinkCardProps = {
  link: Link
  onToggleRead: (id: string, isRead: boolean) => void
  onDelete: (id: string) => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}.${date.getDate()}`
}

function statusLabel(status: Link['status']) {
  switch (status) {
    case 'pending':
      return '요약 대기'
    case 'basic_summary':
      return '기본 요약'
    case 'summary_pending':
      return 'AI 요약 대기'
    case 'crawl_failed':
      return '크롤링 실패'
    default:
      return null
  }
}

export function LinkCard({ link, onToggleRead, onDelete }: LinkCardProps) {
  const statusText = statusLabel(link.status)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline"
    >
      <Card
        className={`gap-3 py-3 transition-opacity ${link.isRead ? 'opacity-60' : ''}`}
      >
        <CardHeader className="px-4">
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {link.title ?? link.url}
          </CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MoreVertical className="size-4" />
                  <span className="sr-only">메뉴</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <DropdownMenuItem
                  onClick={() => onToggleRead(link.id, !link.isRead)}
                >
                  {link.isRead ? (
                    <>
                      <EyeOff className="mr-2 size-4" />안 읽음으로 표시
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 size-4" />
                      읽음으로 표시
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(link.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        {link.oneLineSummary && (
          <CardContent className="px-4">
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {link.oneLineSummary}
            </p>
          </CardContent>
        )}

        <CardFooter className="flex-wrap gap-2 px-4">
          <Badge variant="secondary" className="text-xs">
            {link.contentType === 'youtube' ? 'YouTube' : '아티클'}
          </Badge>
          {statusText && (
            <Badge
              variant="outline"
              className={
                link.status === 'crawl_failed'
                  ? 'border-destructive text-destructive'
                  : ''
              }
            >
              {statusText}
            </Badge>
          )}
          {!link.isRead && (
            <Badge className="text-xs">안 읽음</Badge>
          )}
          {link.estimatedReadTime && (
            <span className="text-muted-foreground text-xs">
              약 {link.estimatedReadTime}분
            </span>
          )}
          <span className="text-muted-foreground ml-auto text-xs">
            {formatDate(link.createdAt)}
          </span>
        </CardFooter>
      </Card>
    </a>
  )
}
