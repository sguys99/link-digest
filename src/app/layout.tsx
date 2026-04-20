import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LinkDigest",
    template: "%s | LinkDigest",
  },
  description: "AI 링크 요약 & 주간 뉴스레터 서비스",
  applicationName: "LinkDigest",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LinkDigest",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "LinkDigest",
    title: "LinkDigest — AI 링크 요약 & 주간 뉴스레터",
    description: "링크를 저장하면 AI가 정리합니다. 모바일 공유 한 번이면 저장 완료.",
    url: "/",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 2038,
        height: 1068,
        alt: "LinkDigest — AI 링크 요약 & 주간 뉴스레터",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkDigest — AI 링크 요약 & 주간 뉴스레터",
    description: "링크를 저장하면 AI가 정리합니다.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
