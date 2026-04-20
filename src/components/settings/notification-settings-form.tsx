"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  notificationSettingsSchema,
  type NotificationSettingsInput,
} from "@/lib/validators/settings";
import { useUpdateSettings } from "@/hooks/use-settings";
import type { NotificationSettings } from "@/types";

type Props = {
  defaultValues: NotificationSettings;
};

export function NotificationSettingsForm({ defaultValues }: Props) {
  const { mutate, isPending } = useUpdateSettings();

  const form = useForm<NotificationSettingsInput>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      slack: {
        enabled: defaultValues.slack.enabled,
        webhookUrl: defaultValues.slack.webhookUrl,
      },
      telegram: {
        enabled: defaultValues.telegram.enabled,
        botToken: defaultValues.telegram.botToken,
        chatId: defaultValues.telegram.chatId,
      },
    },
  });

  const slackEnabled = useWatch({ control: form.control, name: "slack.enabled" });
  const telegramEnabled = useWatch({ control: form.control, name: "telegram.enabled" });

  function onSubmit(data: NotificationSettingsInput) {
    mutate({ notificationSettings: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Slack */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Slack</h4>

          <FormField
            control={form.control}
            name="slack.enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Slack 알림</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {slackEnabled && (
            <FormField
              control={form.control}
              name="slack.webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        {/* Telegram */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Telegram</h4>

          <FormField
            control={form.control}
            name="telegram.enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Telegram 알림</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {telegramEnabled && (
            <>
              <FormField
                control={form.control}
                name="telegram.botToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Token</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="123456:ABC-DEF..."
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram.chatId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chat ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="-1001234567890"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </form>
    </Form>
  );
}
