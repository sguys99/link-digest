"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const form = useForm<LlmSettingsInput>({
    resolver: zodResolver(llmSettingsSchema),
    defaultValues: {
      provider: defaultValues.provider,
      apiKey: defaultValues.apiKey,
      model: defaultValues.model,
    },
  });

  const selectedProvider = useWatch({ control: form.control, name: "provider" });

  function onSubmit(data: LlmSettingsInput) {
    mutate({ llmSettings: data });
  }

  function handleReset() {
    const resetValues = { provider: null, apiKey: null, model: null };
    mutate(
      { llmSettings: resetValues },
      {
        onSuccess: () => {
          form.reset(resetValues);
          setResetDialogOpen(false);
        },
      },
    );
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

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "저장 중..." : "저장"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || !defaultValues.provider}
            onClick={() => setResetDialogOpen(true)}
            className="flex-1"
          >
            설정 해제
          </Button>
        </div>
      </form>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>LLM 설정을 초기화하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              AI 제공자, API 키, 모델 설정이 모두 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "초기화 중..." : "초기화"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
