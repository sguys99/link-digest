import { Separator } from '@/components/ui/separator'

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-tight">LinkDigest</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} LinkDigest
          </span>
        </div>
        <nav className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
