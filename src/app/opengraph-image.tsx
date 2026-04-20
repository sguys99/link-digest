import { ImageResponse } from "next/og";

export const alt = "LinkDigest — AI 링크 요약 & 주간 뉴스레터";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0b2540 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            L
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            LinkDigest
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "84px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            <span>링크를 저장하면,</span>
            <span>AI가 정리합니다.</span>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#cbd5f5",
              lineHeight: 1.4,
            }}
          >
            모바일 공유 한 번이면 저장 완료. 주간 뉴스레터로 다시 만나요.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "24px",
            color: "#94a3b8",
          }}
        >
          <span>AI 링크 요약 & 주간 뉴스레터</span>
          <span>linkdigest</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
