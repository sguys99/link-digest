'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FilterTabsProps = {
  value: string
  onValueChange: (value: string) => void
}

export function FilterTabs({ value, onValueChange }: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="h-auto w-fit gap-1 bg-transparent p-0">
        <TabsTrigger
          value="all"
          className="rounded-full px-4 py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none"
        >
          전체
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="rounded-full px-4 py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none"
        >
          안 읽음
        </TabsTrigger>
        <TabsTrigger
          value="read"
          className="rounded-full px-4 py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none"
        >
          읽음
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
