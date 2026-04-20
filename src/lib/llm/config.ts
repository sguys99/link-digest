import type { LlmConfig } from "./types";

const DEFAULT_MODELS: Record<LlmConfig["provider"], string> = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-6",
  google: "gemini-2.0-flash",
};

/**
 * 사용자 LLM 설정 조회: DB 설정 우선, env fallback.
 * llm_settings JSON이 유효하면 사용, 아니면 환경변수에서 첫 번째 발견된 키 사용.
 */
export function resolveLlmConfig(
  userSettings: Record<string, unknown> | null,
): LlmConfig | null {
  // 1. 사용자 DB 설정 확인
  if (
    userSettings &&
    typeof userSettings.provider === "string" &&
    typeof userSettings.api_key === "string" &&
    userSettings.api_key.length > 0
  ) {
    const provider = userSettings.provider as LlmConfig["provider"];
    return {
      provider,
      model:
        typeof userSettings.model === "string" && userSettings.model.length > 0
          ? userSettings.model
          : DEFAULT_MODELS[provider] ?? DEFAULT_MODELS.openai,
      apiKey: userSettings.api_key,
    };
  }

  // 2. 환경변수 fallback (순서: Anthropic → OpenAI → Google)
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic",
      model: process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic,
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
      apiKey: process.env.OPENAI_API_KEY,
    };
  }
  if (process.env.GOOGLE_AI_API_KEY) {
    return {
      provider: "google",
      model: process.env.GOOGLE_MODEL || DEFAULT_MODELS.google,
      apiKey: process.env.GOOGLE_AI_API_KEY,
    };
  }

  return null;
}

/**
 * 사용자 본인 키가 없고 환경변수 fallback(예: 무료 Gemini)으로 동작 중인지 판정.
 * 배너 문구 분기 및 무료 사용자 rate limit 차등 적용에 사용.
 */
export function isUsingEnvFallback(
  userSettings: Record<string, unknown> | null,
): boolean {
  const hasUserKey =
    !!userSettings &&
    typeof userSettings.provider === "string" &&
    typeof userSettings.api_key === "string" &&
    (userSettings.api_key as string).length > 0;

  if (hasUserKey) return false;
  return resolveLlmConfig(null) !== null;
}
