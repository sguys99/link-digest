"use client";

import { useSettings } from "@/hooks/use-settings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LlmSettingsForm } from "./llm-settings-form";
import { NewsletterSettingsForm } from "./newsletter-settings-form";
import { NotificationSettingsForm } from "./notification-settings-form";
import { SettingsSkeleton } from "./settings-skeleton";
import { NewsletterPreview } from "./newsletter-preview";

export function SettingsContent() {
  const { data, isLoading, isError } = useSettings();

  if (isLoading) return <SettingsSkeleton />;

  if (isError || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        설정을 불러오는 데 실패했습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">LLM 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <LlmSettingsForm defaultValues={data.llmSettings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">뉴스레터 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterSettingsForm defaultValues={data.newsletterSettings} />
          <div className="mt-4 pt-4 border-t">
            <NewsletterPreview />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">알림 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSettingsForm
            defaultValues={data.notificationSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
}
