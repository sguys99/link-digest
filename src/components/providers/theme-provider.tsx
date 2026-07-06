'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

// next-themes 래퍼: 클래스 전략(.dark) + 시스템 연동 기본.
// disableTransitionOnChange로 테마 전환 시 전역 색 트랜지션 깜빡임 제거.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
