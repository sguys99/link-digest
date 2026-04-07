"use client";

import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useState } from "react";

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DAYS = 7;

function getInitialDismissed() {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  return Date.now() - dismissedAt <= DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function InstallBanner() {
  const { isInstallable, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(getInitialDismissed);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) setDismissed(true);
  };

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-lg">
        <Download className="h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">앱 설치하기</p>
          <p className="text-xs text-muted-foreground">
            홈 화면에 추가하여 빠르게 접근하세요
          </p>
        </div>
        <Button size="sm" onClick={handleInstall}>
          설치
        </Button>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
