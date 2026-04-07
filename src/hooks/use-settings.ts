"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/lib/api/settings";
import type { UpdateSettingsInput } from "@/lib/validators/settings";

const SETTINGS_KEY = "settings";

export function useSettings() {
  return useQuery({
    queryKey: [SETTINGS_KEY],
    queryFn: getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSettingsInput) => updateSettings(input),
    onSuccess: (data) => {
      queryClient.setQueryData([SETTINGS_KEY], data);
      toast.success("설정이 저장되었습니다.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "설정 저장에 실패했습니다.",
      );
    },
  });
}
