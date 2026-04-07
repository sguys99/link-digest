import type { SettingsResponse } from "@/types";
import type { UpdateSettingsInput } from "@/lib/validators/settings";
import { handleResponse } from "./fetch-utils";

export async function getSettings(): Promise<SettingsResponse> {
  const res = await fetch("/api/settings");
  return handleResponse<SettingsResponse>(res);
}

export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<SettingsResponse> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<SettingsResponse>(res);
}
