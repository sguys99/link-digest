"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createAnnouncementSchema,
  type CreateAnnouncementInput,
} from "@/lib/validators/announcement";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/use-announcements";
import type { Announcement } from "@/types";

type AnnouncementFormProps = {
  mode: "create" | "edit";
  announcement?: Announcement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnnouncementForm({
  mode,
  announcement,
  open,
  onOpenChange,
}: AnnouncementFormProps) {
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const form = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: announcement?.title ?? "",
      content: announcement?.content ?? "",
    },
  });

  const onSubmit = async (data: CreateAnnouncementInput) => {
    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      });
    } else if (announcement) {
      updateMutation.mutate(
        { id: announcement.id, ...data },
        {
          onSuccess: () => onOpenChange(false),
        },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "새 공지사항 작성" : "공지사항 수정"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="공지사항 제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <textarea
                      className="border-input bg-background placeholder:text-muted-foreground flex min-h-[200px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="공지사항 내용을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "저장 중..."
                  : mode === "create"
                    ? "등록"
                    : "수정"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
