'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FilterTabsProps = {
  value: string
  onValueChange: (value: string) => void
}

export function FilterTabs({ value, onValueChange }: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="w-full">
        <TabsTrigger value="all" className="min-h-[44px] flex-1">
          전체
        </TabsTrigger>
        <TabsTrigger value="unread" className="min-h-[44px] flex-1">
          안 읽음
        </TabsTrigger>
        <TabsTrigger value="read" className="min-h-[44px] flex-1">
          읽음
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
