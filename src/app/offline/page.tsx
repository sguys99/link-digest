"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">오프라인 상태입니다</h1>
            <p className="text-sm text-muted-foreground">
              인터넷 연결을 확인한 후 다시 시도해주세요.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            다시 시도
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
