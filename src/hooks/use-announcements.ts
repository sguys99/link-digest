"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/api/announcements";
import type { Announcement, PaginatedResponse } from "@/types";

const ANNOUNCEMENTS_KEY = "announcements";
const PAGE_LIMIT = 20;

export function useAnnouncements() {
  return useInfiniteQuery({
    queryKey: [ANNOUNCEMENTS_KEY],
    queryFn: ({ pageParam }) =>
      getAnnouncements({ cursor: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; content: string }) =>
      createAnnouncement(input),
    onSuccess: () => {
      toast.success("공지사항이 등록되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      title?: string;
      content?: string;
      isPublished?: boolean;
    }) => updateAnnouncement(id, input),
    onMutate: async ({ id, ...input }) => {
      await queryClient.cancelQueries({ queryKey: [ANNOUNCEMENTS_KEY] });

      const previousData = queryClient.getQueriesData<{
        pages: PaginatedResponse<Announcement>[];
        pageParams: unknown[];
      }>({ queryKey: [ANNOUNCEMENTS_KEY] });

      queryClient.setQueriesData<{
        pages: PaginatedResponse<Announcement>[];
        pageParams: unknown[];
      }>({ queryKey: [ANNOUNCEMENTS_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === id ? { ...item, ...input } : item,
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("공지사항 수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [ANNOUNCEMENTS_KEY] });

      const previousData = queryClient.getQueriesData<{
        pages: PaginatedResponse<Announcement>[];
        pageParams: unknown[];
      }>({ queryKey: [ANNOUNCEMENTS_KEY] });

      queryClient.setQueriesData<{
        pages: PaginatedResponse<Announcement>[];
        pageParams: unknown[];
      }>({ queryKey: [ANNOUNCEMENTS_KEY] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== id),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("공지사항 삭제에 실패했습니다.");
    },
    onSuccess: () => {
      toast.success("공지사항이 삭제되었습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] });
    },
  });
}
