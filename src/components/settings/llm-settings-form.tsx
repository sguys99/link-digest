"use client";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { llmSettingsSchema, type LlmSettingsInput } from "@/lib/validators/settings";
import { useUpdateSettings } from "@/hooks/use-settings";
import type { LlmSettings } from "@/types";

const DEFAULT_MODELS: Record<string, string> = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-6",
  google: "gemini-2.0-flash",
};

type Props = {
  defaultValues: LlmSettings;
};

export function LlmSettingsForm({ defaultValues }: Props) {
  const { mutate, isPending } = useUpdateSettings();

  const form = useForm<LlmSettingsInput>({
    resolver: zodResolver(llmSettingsSchema),
    defaultValues: {
      provider: defaultValues.provider,
      apiKey: defaultValues.apiKey,
      model: defaultValues.model,
    },
  });

  const selectedProvider = form.watch("provider");

  function onSubmit(data: LlmSettingsInput) {
    mutate({ llmSettings: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI 제공자</FormLabel>
              <Select
                onValueChange={(val) =>
                  field.onChange(val === "__none" ? null : val)
                }
                value={field.value ?? "__none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__none">미설정</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API 키</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value || null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>모델 (선택)</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedProvider
                      ? DEFAULT_MODELS[selectedProvider] ?? "모델명 입력"
                      : "모델명 입력"
                  }
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value || null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </form>
    </Form>
  );
}
