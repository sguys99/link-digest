'use client'

import { useAnimateOnScroll } from '@/hooks/use-animate-on-scroll'
import { cn } from '@/lib/utils'

type AnimateOnScrollProps = {
  children: React.ReactNode
  className?: string
}

export function AnimateOnScroll({
  children,
  className,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
