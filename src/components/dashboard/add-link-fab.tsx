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

export function AddLinkFab() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 right-4 z-40 size-12 rounded-full shadow-lg"
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
