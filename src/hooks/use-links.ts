'use client'

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { getLinks, createLink, updateLink, deleteLink } from '@/lib/api/links'
import type { Link, PaginatedResponse } from '@/types'

const LINKS_KEY = 'links'
const PAGE_LIMIT = 20

type LinksFilter = {
  isRead?: boolean
}

export function useLinks(filter: LinksFilter = {}) {
  return useInfiniteQuery({
    queryKey: [LINKS_KEY, filter],
    queryFn: ({ pageParam }) =>
      getLinks({ cursor: pageParam, limit: PAGE_LIMIT, isRead: filter.isRead }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useToggleRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      updateLink(id, { isRead }),
    onMutate: async ({ id, isRead }) => {
      await queryClient.cancelQueries({ queryKey: [LINKS_KEY] })

      const previousData = queryClient.getQueriesData<
        { pages: PaginatedResponse<Link>[]; pageParams: unknown[] }
      >({ queryKey: [LINKS_KEY] })

      queryClient.setQueriesData<
        { pages: PaginatedResponse<Link>[]; pageParams: unknown[] }
      >({ queryKey: [LINKS_KEY] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((link) =>
              link.id === id ? { ...link, isRead } : link
            ),
          })),
        }
      })

      return { previousData }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data)
        }
      }
      toast.error('링크 상태 변경에 실패했습니다.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [LINKS_KEY] })
    },
  })
}

export function useAddLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { url: string; title?: string }) => createLink(input),
    onSuccess: () => {
      toast.success('링크가 저장되었습니다!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [LINKS_KEY] })
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [LINKS_KEY] })

      const previousData = queryClient.getQueriesData<
        { pages: PaginatedResponse<Link>[]; pageParams: unknown[] }
      >({ queryKey: [LINKS_KEY] })

      queryClient.setQueriesData<
        { pages: PaginatedResponse<Link>[]; pageParams: unknown[] }
      >({ queryKey: [LINKS_KEY] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((link) => link.id !== id),
          })),
        }
      })

      return { previousData }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data)
        }
      }
      toast.error('링크 삭제에 실패했습니다.')
    },
    onSuccess: () => {
      toast.success('링크가 삭제되었습니다.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [LINKS_KEY] })
    },
  })
}
