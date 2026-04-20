'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLinks, useToggleRead, useDeleteLink } from '@/hooks/use-links'
import { LinkCard } from './link-card'
import { LinkCardSkeletonList } from './link-card-skeleton'
import { FilterTabs } from './filter-tabs'
import { EmptyState } from './empty-state'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { Button } from '@/components/ui/button'

function filterToIsRead(filter: string): boolean | undefined {
  if (filter === 'unread') return false
  if (filter === 'read') return true
  return undefined
}

const emptyMessages: Record<string, string> = {
  all: '저장된 링크가 없습니다',
  unread: '읽지 않은 링크가 없습니다',
  read: '읽은 링크가 없습니다',
}

export function LinkCardList() {
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const isRead = filterToIsRead(filter)
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useLinks({ isRead })

  const toggleRead = useToggleRead()
  const deleteLinkMutation = useDeleteLink()

  // 무한 스크롤 Intersection Observer
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0, rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleToggleRead = useCallback(
    (id: string, isRead: boolean) => {
      toggleRead.mutate({ id, isRead })
    },
    [toggleRead]
  )

  const handleDelete = useCallback((id: string) => {
    setDeleteTarget(id)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return
    deleteLinkMutation.mutate(deleteTarget, {
      onSettled: () => setDeleteTarget(null),
    })
  }, [deleteTarget, deleteLinkMutation])

  const links = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div className="space-y-4 pt-4">
      <FilterTabs value={filter} onValueChange={setFilter} />

      {isLoading && <LinkCardSkeletonList />}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="text-muted-foreground text-sm">
            링크 목록을 불러오지 못했습니다.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      )}

      {!isLoading && !isError && links.length === 0 && (
        <EmptyState message={emptyMessages[filter]} />
      )}

      {!isLoading && !isError && links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 무한 스크롤 감지 요소 */}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <LinkCardSkeletonList />}

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteLinkMutation.isPending}
      />
    </div>
  )
}
