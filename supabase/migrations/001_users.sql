-- ============================================
-- Phase 1: public.users 테이블 + Auth Trigger
-- ============================================

-- 1. public.users 테이블 생성 (PRD 5.1 기준)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,

  -- LLM 설정
  llm_settings JSONB NOT NULL DEFAULT '{
    "provider": null,
    "api_key": null
  }'::jsonb,

  -- 뉴스레터 설정
  newsletter_settings JSONB NOT NULL DEFAULT '{
    "enabled": true,
    "email": null,
    "day_of_week": 1,
    "hour": 8,
    "timezone": "Asia/Seoul"
  }'::jsonb,

  -- 알림 설정
  notification_settings JSONB NOT NULL DEFAULT '{
    "slack": { "enabled": false, "webhook_url": null },
    "telegram": { "enabled": false, "bot_token": null, "chat_id": null }
  }'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 인덱스
CREATE INDEX idx_users_email ON public.users(email);

-- 3. RLS 활성화 + 정책
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 4. updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 5. Auth Trigger: auth.users INSERT 시 public.users 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, newsletter_settings)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    jsonb_build_object(
      'enabled', true,
      'email', NEW.email,
      'day_of_week', 1,
      'hour', 8,
      'timezone', 'Asia/Seoul'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
