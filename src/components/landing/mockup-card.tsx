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
    title: 'GPT-5 출시, 무엇이 달라졌나',
    summary: '멀티모달 추론 능력과 100만 토큰 컨텍스트. AI 업계의 새로운 기준점을 분석합니다.',
    contentType: 'article',
    readTime: 8,
    date: '4.7',
  },
  {
    title: '2026 글로벌 반도체 시장 전망',
    summary: 'AI 칩 수요 폭증과 공급망 재편. 엔비디아, TSMC, 삼성의 전략을 비교합니다.',
    contentType: 'article',
    readTime: 12,
    date: '4.5',
    isRead: true,
  },
  {
    title: '연준 금리 동결, 시장 영향은?',
    summary: '5월 FOMC 결과와 투자 전략. 채권·주식·암호화폐 시장 반응을 정리했습니다.',
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
