'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AddLinkForm } from './add-link-form'

type AddLinkFabProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddLinkFab({ open, onOpenChange }: AddLinkFabProps = {}) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const actualOpen = isControlled ? open : internalOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <Sheet open={actualOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          // 잉크 원형 FAB: 무그림자 원칙 → shadow-lg 제거, 엣지 정의용 hairline border만.
          // 잉크/캔버스(다크 시 반전) 대비가 강해 축소판 그림자 불필요. rounded-full은 base 상속.
          className="fixed bottom-20 right-4 z-40 size-12 border border-border"
        >
          <Plus className="size-5" />
          <span className="sr-only">링크 추가</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>링크 추가</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center px-4 pb-6">
          <AddLinkForm
            variant="sheet"
            autoFocus
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
