"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** text 파라미터에서 URL 추출 */
function extractUrlFromText(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

export default function SharePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const urlParam = searchParams.get("url");
    const textParam = searchParams.get("text");
    const titleParam = searchParams.get("title");

    // URL 결정: url 파라미터 우선, 없으면 text에서 추출
    const url = urlParam || (textParam ? extractUrlFromText(textParam) : null);

    if (!url) {
      toast.error("저장할 URL이 없습니다.");
      router.replace("/dashboard");
      return;
    }

    async function saveLink() {
      try {
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, title: titleParam || undefined }),
        });

        if (res.status === 201) {
          toast.success("링크가 저장되었습니다!");
        } else if (res.status === 409) {
          toast.info("이미 저장된 링크입니다.");
        } else if (res.status === 429) {
          const data = await res.json().catch(() => null);
          toast.error(
            data?.error?.message ?? "오늘 저장 한도를 초과했습니다.",
          );
        } else {
          toast.error("링크 저장에 실패했습니다.");
        }
      } catch {
        toast.error("네트워크 오류가 발생했습니다.");
      }

      router.replace("/dashboard");
    }

    saveLink();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
        <p className="text-sm text-muted-foreground">링크를 저장하는 중...</p>
      </div>
    </div>
  );
}
