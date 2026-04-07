"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-destructive-foreground">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">
        오프라인 상태입니다. 일부 기능이 제한됩니다.
      </span>
    </div>
  );
}
