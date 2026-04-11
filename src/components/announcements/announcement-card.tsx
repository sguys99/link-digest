"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
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
    <Card className="transition-colors hover:bg-accent/50">
      <Link href={`/announcements/${announcement.id}`} className="contents">
        <CardHeader>
          <CardTitle className="text-lg">{announcement.title}</CardTitle>
          <CardDescription>
            {formattedDate}
            {isAdmin && !announcement.isPublished && (
              <Badge variant="secondary" className="ml-2">
                임시저장
              </Badge>
            )}
          </CardDescription>
          {isAdmin && (
            <CardAction>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1"
              >
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
                    <Button
                      variant="ghost"
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
                        이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수
                        없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteMutation.mutate(announcement.id)
                        }
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {announcement.content}
          </p>
        </CardContent>
      </Link>

      {isEditing && (
        <AnnouncementForm
          mode="edit"
          announcement={announcement}
          open={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </Card>
  );
}
