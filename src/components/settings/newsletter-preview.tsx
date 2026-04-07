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
            <iframe
              srcDoc={html}
              title="뉴스레터 미리보기"
              className="w-full h-[60vh] border rounded-md"
              sandbox=""
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
