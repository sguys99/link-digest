import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">LinkDigest</h1>
      <p className="text-muted-foreground">
        AI 링크 요약 & 주간 뉴스레터 서비스
      </p>
      <Button>시작하기</Button>
    </main>
  );
}
