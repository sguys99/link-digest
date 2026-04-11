"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/use-announcements";
import { AnnouncementForm } from "./announcement-form";
import type { Announcement } from "@/types";

type AnnouncementCardProps = {
  announcement: Announcement;
  isAdmin: boolean;
};

export function AnnouncementCard({
  announcement,
  isAdmin,
}: AnnouncementCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article className="border-b py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-lg font-semibold">{announcement.title}</h2>
            {isAdmin && !announcement.isPublished && (
              <Badge variant="secondary">임시저장</Badge>
            )}
          </div>
          <time className="text-muted-foreground text-sm">{formattedDate}</time>
        </div>
        {isAdmin && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateMutation.mutate({
                  id: announcement.id,
                  isPublished: !announcement.isPublished,
                })
              }
              disabled={updateMutation.isPending}
            >
              {announcement.isPublished ? "비공개" : "공개"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive">
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(announcement.id)}
                    disabled={deleteMutation.isPending}
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
        {announcement.content}
      </div>

      {isEditing && (
        <AnnouncementForm
          mode="edit"
          announcement={announcement}
          open={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </article>
  );
}
