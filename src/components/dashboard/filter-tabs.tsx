'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FilterTabsProps = {
  value: string
  onValueChange: (value: string) => void
}

export function FilterTabs({ value, onValueChange }: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList variant="pill" className="h-auto w-fit">
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="unread">안 읽음</TabsTrigger>
        <TabsTrigger value="read">읽음</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
