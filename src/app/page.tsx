import { LoginButton } from '@/components/auth/login-button'
import { Link2, Sparkles, Mail } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">LinkDigest</h1>
          <p className="text-muted-foreground">
            링크를 저장하면 AI가 요약해드립니다
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">모바일 공유 시트에서 바로 저장</p>
              <p className="text-xs text-muted-foreground">
                브라우저 공유 버튼 한 번이면 끝
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">AI가 핵심만 요약</p>
              <p className="text-xs text-muted-foreground">
                한 줄 요약 + 핵심 포인트 3가지
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">주간 뉴스레터로 복습</p>
              <p className="text-xs text-muted-foreground">
                매주 한 번, 지난 링크를 정리해서 이메일로
              </p>
            </div>
          </div>
        </div>

        {/* 로그인 */}
        <LoginButton />
      </div>
    </main>
  )
}
