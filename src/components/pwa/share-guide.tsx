"use client";

import { useEffect, useState } from "react";
import { Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const DISMISS_KEY = "pwa-ios-guide-dismissed";

export function ShareGuide() {
  const { isIOS, isStandalone } = usePwaInstall();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isIOS || isStandalone) return;
    const wasDismissed = localStorage.getItem(DISMISS_KEY);
    if (!wasDismissed) setOpen(true);
  }, [isIOS, isStandalone]);

  const handleClose = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  if (!isIOS || isStandalone) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>홈 화면에 추가하기</DialogTitle>
          <DialogDescription>
            LinkDigest를 앱처럼 사용하려면 홈 화면에 추가하세요.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              1
            </span>
            <div className="flex items-center gap-1.5">
              하단 메뉴에서{" "}
              <Share className="inline h-4 w-4" />{" "}
              <strong>공유</strong> 버튼을 탭하세요
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              2
            </span>
            <div className="flex items-center gap-1.5">
              아래로 스크롤하여{" "}
              <Plus className="inline h-4 w-4" />{" "}
              <strong>홈 화면에 추가</strong>를 탭하세요
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              3
            </span>
            <div>
              오른쪽 상단의 <strong>추가</strong>를 탭하세요
            </div>
          </li>
        </ol>
        <Button onClick={handleClose} className="w-full">
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
}
