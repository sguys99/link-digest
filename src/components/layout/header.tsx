import Link from 'next/link'
import { UserMenu } from '@/components/auth/user-menu'

type HeaderProps = {
  email: string
  displayName: string | null
  avatarUrl: string | null
}

export function Header({ email, displayName, avatarUrl }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          LinkDigest
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/announcements"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            공지사항
          </Link>
          <UserMenu
            email={email}
            displayName={displayName}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </header>
  )
}
