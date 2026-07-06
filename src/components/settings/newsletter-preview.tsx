"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewsletterPreview() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen(open: boolean) {
    if (!open) return;

    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/api/newsletter/preview");
      if (!res.ok) {
        throw new Error("미리보기를 불러오지 못했습니다.");
      }
      const text = await res.text();
      setHtml(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          뉴스레터 미리보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>뉴스레터 미리보기</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto min-h-0">
          {loading && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              불러오는 중...
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive py-8 text-center">{error}</p>
          )}
          {html && (
            // iframe 자체 radius는 내용까지 클리핑되지 않을 수 있어 래퍼로 감싸 18px 라운드 처리.
            // 이메일은 라이트 고정이라 다크 다이얼로그(#272729) 위에서 흰 프레임이 hairline border로 분리된다.
            <div className="overflow-hidden rounded-2xl border">
              <iframe
                srcDoc={html}
                title="뉴스레터 미리보기"
                className="w-full h-[60vh]"
                sandbox=""
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
