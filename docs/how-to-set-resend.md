# Resend 설정 및 테스트 가이드

## 1. Resend 회원가입 및 API 키 발급

1. [resend.com](https://resend.com) 접속 → **Sign Up** (GitHub 계정 가능)
2. 로그인 후 좌측 사이드바 → **API Keys** → **Create API Key**
   - Name: `link-digest` (구분용, 자유 입력)
   - Permission: **Sending access**
3. 생성된 키(`re_xxxxxxxxxx`)를 복사
4. `.env.local`에 설정:
   ```
   RESEND_API_KEY=re_xxxxxxxxxx
   ```

> API 키는 생성 직후에만 확인 가능. 즉시 복사할 것.

---

## 2. 발송 방식 선택

### 방법 A: 테스트용 (도메인 없이 즉시 사용)

별도 도메인 설정 없이 바로 사용 가능.

```
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**제한사항:**
- 수신자가 **Resend 가입 시 사용한 본인 이메일 1개**로만 발송 가능
- 다른 이메일 주소로는 발송 차단됨
- 개발/테스트 단계에서 사용

### 방법 B: 프로덕션용 (커스텀 도메인)

1. 좌측 사이드바 → **Domains** → **Add Domain**
2. 보유한 도메인 입력 (예: `linkdigest.com`)
3. Resend가 안내하는 DNS 레코드 3개를 도메인 DNS 관리 패널에서 추가:

   | 타입 | 용도 |
   |------|------|
   | MX | 바운스 처리 |
   | TXT | SPF 인증 |
   | CNAME | DKIM 서명 |

4. Resend 대시보드에서 **Verify** 클릭 (DNS 전파에 수분~수시간 소요)
5. Status가 **Verified**로 변경되면 완료
6. `.env.local` 업데이트:
   ```
   RESEND_FROM_EMAIL=digest@linkdigest.com
   ```

커스텀 도메인 등록 후에는 모든 이메일 주소로 발송 가능.

---

## 3. 환경변수 설정

`.env.local`에 다음 항목 설정:

```bash
# Resend API 키
RESEND_API_KEY=re_xxxxxxxxxx

# 발신자 이메일 (테스트: onboarding@resend.dev / 프로덕션: 커스텀 도메인 이메일)
RESEND_FROM_EMAIL=onboarding@resend.dev

# Cron 인증용 시크릿 (아무 문자열이나 설정)
CRON_SECRET=test123
```

---

## 4. 뉴스레터 테스트 방법

### 사전 준비

1. Settings 페이지에서 뉴스레터 설정:
   - 활성화: **ON**
   - 이메일: **Resend 가입 시 사용한 이메일** (테스트 단계)
   - 요일: **현재 요일** (월=1, 화=2, 수=3, 목=4, 금=5, 토=6, 일=7)
   - 시간: **현재 시** (0~23, 예: 오후 2시면 14)
   - 타임존: **Asia/Seoul**
   - 저장

2. 완료된 링크가 1개 이상 있어야 함 (status가 `completed`인 링크)

> 현재 요일/시간 확인: 터미널에서 `date "+%A %H:%M"` 실행

### 수동 발송 테스트

개발 서버 실행 후:

```bash
npm run dev
```

다른 터미널에서 curl 실행:

```bash
curl -H "Authorization: Bearer test123" http://localhost:3000/api/cron/newsletter
```

### 응답 해석

| 응답 | 의미 |
|------|------|
| `{"sent":1,"skipped":0,"failed":0}` | 발송 성공. 이메일 수신 확인 |
| `{"sent":0,"skipped":1,"failed":0}` | 사용자 매칭 성공, 최근 7일간 완료된 링크 없음 |
| `{"sent":0,"skipped":0,"failed":0}` | 매칭된 사용자 없음 (설정 확인 필요) |
| `{"sent":0,"skipped":0,"failed":1}` | Resend API 오류 (API 키/이메일 확인) |

### 미리보기 (발송 없이 확인)

Settings 페이지에서 **"뉴스레터 미리보기"** 버튼 클릭 → 실제 링크 데이터로 렌더링된 이메일을 브라우저에서 바로 확인 가능.

---

## 5. 디버깅

개발 서버 터미널에서 다음 로그를 확인:

```
[newsletter-cron] 뉴스레터 활성 사용자: N명
[newsletter-cron] 현재 시간: 2026-04-07T07:05:00.000Z, 매칭 사용자: N명
[newsletter-cron] 완료: sent=1, skipped=0, failed=0
```

- **활성 사용자 0명**: DB에서 뉴스레터가 활성화되지 않았거나 이메일이 비어있음
- **매칭 사용자 0명**: 설정된 요일/시간이 현재와 불일치
- **failed**: Resend 대시보드 → **Logs**에서 상세 에러 확인

---

## 6. Resend 대시보드 모니터링

발송 후 [resend.com](https://resend.com) → **Emails** 탭에서:
- 발송 상태 (Delivered / Bounced / Complained)
- 수신자 이메일
- 발송 시간

확인 가능.
