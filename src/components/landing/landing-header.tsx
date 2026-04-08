'use client'

import { useEffect, useState } from 'react'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleStart = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b bg-background/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-screen-lg items-center justify-between px-4 md:px-8">
        <span className="text-lg font-bold tracking-tight">LinkDigest</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/sguys99/link-digest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-5" />
          </a>
          <Button size="sm" onClick={handleStart}>
            시작하기
          </Button>
        </div>
      </div>
    </header>
  )
}
