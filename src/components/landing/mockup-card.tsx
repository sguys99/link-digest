import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type MockupCardData = {
  title: string
  summary: string
  contentType: 'article' | 'youtube'
  readTime: number
  date: string
  isRead?: boolean
}

const sampleLinks: MockupCardData[] = [
  {
    title: 'Next.js 16의 새로운 캐싱 전략',
    summary: '서버 컴포넌트 캐싱이 더욱 세밀해졌습니다. use cache 디렉티브와 cacheLife 설정을 활용하는 방법.',
    contentType: 'article',
    readTime: 8,
    date: '4.7',
  },
  {
    title: '프론트엔드 개발자를 위한 AI 도구 10선',
    summary: 'Cursor, Copilot부터 v0까지. 실무에서 생산성을 높여주는 AI 도구를 정리했습니다.',
    contentType: 'article',
    readTime: 12,
    date: '4.5',
    isRead: true,
  },
  {
    title: 'React 서버 컴포넌트 Deep Dive',
    summary: 'RSC의 동작 원리를 시각적으로 설명합니다. 클라이언트와 서버의 경계를 이해하세요.',
    contentType: 'youtube',
    readTime: 25,
    date: '4.3',
  },
]

function MockupCardItem({ link }: { link: MockupCardData }) {
  return (
    <Card
      className={`gap-2 py-2.5 ${link.isRead ? 'opacity-60' : ''}`}
    >
      <CardHeader className="px-3">
        <CardTitle className="line-clamp-1 text-xs font-medium">
          {link.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <p className="text-muted-foreground line-clamp-1 text-[11px]">
          {link.summary}
        </p>
      </CardContent>
      <CardFooter className="flex-wrap gap-1.5 px-3">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {link.contentType === 'youtube' ? 'YouTube' : '아티클'}
        </Badge>
        {!link.isRead && (
          <Badge className="text-[10px] px-1.5 py-0">안 읽음</Badge>
        )}
        <span className="text-muted-foreground text-[10px]">
          약 {link.readTime}분
        </span>
        <span className="text-muted-foreground ml-auto text-[10px]">
          {link.date}
        </span>
      </CardFooter>
    </Card>
  )
}

export function MockupCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {sampleLinks.slice(0, count).map((link) => (
        <MockupCardItem key={link.title} link={link} />
      ))}
    </div>
  )
}
