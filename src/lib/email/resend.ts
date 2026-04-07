import { Resend } from "resend";

let resendInstance: Resend | null = null;

/** Resend 클라이언트 싱글톤 */
export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY 환경변수가 설정되지 않았습니다.");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/** 발신자 이메일 주소 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}
