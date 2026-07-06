"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 시스템/라이트/다크 3-세그먼트. 활성 = 잉크 pill(무채색), 액센트 유채색 미사용.
const OPTIONS = [
  { value: "system", label: "시스템", icon: Monitor },
  { value: "light", label: "라이트", icon: Sun },
  { value: "dark", label: "다크", icon: Moon },
] as const;

// 하이드레이션 가드: 서버=false, 클라이언트=true. useEffect+setState 대신
// useSyncExternalStore로 구독 없이 마운트 여부만 판별(react-hooks 규칙 정합).
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // 마운트 전에는 theme 미확정 → 활성 세그먼트 표시 보류(하이드레이션 불일치 방지)
  const current = mounted ? theme : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base tracking-tight">화면 설정</CardTitle>
        <CardDescription>앱의 밝기 테마를 선택합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          role="radiogroup"
          aria-label="테마 선택"
          className="inline-flex w-full gap-1 rounded-full bg-muted p-1"
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = current === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
