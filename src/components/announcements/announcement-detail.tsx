"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

type AnnouncementDetailProps = {
  announcement: Announcement;
  isAdmin: boolean;
};

export function AnnouncementDetail({
  announcement,
  isAdmin,
}: AnnouncementDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const handleDelete = () => {
    deleteMutation.mutate(announcement.id, {
      onSuccess: () => router.push("/announcements"),
    });
  };

  return (
    <article>
      <Link
        href="/announcements"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Link>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{announcement.title}</h1>
          {isAdmin && !announcement.isPublished && (
            <Badge variant="secondary">임시저장</Badge>
          )}
        </div>
        <time className="mt-2 block text-sm text-muted-foreground">
          {formattedDate}
        </time>
      </div>

      {isAdmin && (
        <div className="mb-6 flex items-center gap-2 border-b pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateMutation.mutate(
                {
                  id: announcement.id,
                  isPublished: !announcement.isPublished,
                },
                { onSuccess: () => router.refresh() },
              )
            }
            disabled={updateMutation.isPending}
          >
            {announcement.isPublished ? "비공개로 변경" : "공개로 변경"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            수정
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
              >
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
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {announcement.content}
      </div>

      {isEditing && (
        <AnnouncementForm
          mode="edit"
          announcement={announcement}
          open={isEditing}
          onOpenChange={(open) => {
            setIsEditing(open);
            if (!open) router.refresh();
          }}
        />
      )}
    </article>
  );
}
