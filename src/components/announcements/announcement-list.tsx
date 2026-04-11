"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAnnouncements } from "@/hooks/use-announcements";
import { AnnouncementCard } from "./announcement-card";
import { AnnouncementForm } from "./announcement-form";
import type { Announcement } from "@/types";

type AnnouncementListProps = {
  isAdmin: boolean;
  initialData: Announcement[];
};

export function AnnouncementList({
  isAdmin,
  initialData,
}: AnnouncementListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAnnouncements();

  const announcements =
    data?.pages.flatMap((page) => page.data) ?? initialData;

  return (
    <div>
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsCreating(true)}>새 공지 작성</Button>
        </div>
      )}

      {announcements.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isAdmin={isAdmin}
            />
          ))}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </Button>
            </div>
          )}
        </div>
      )}

      {isCreating && (
        <AnnouncementForm
          mode="create"
          open={isCreating}
          onOpenChange={setIsCreating}
        />
      )}
    </div>
  );
}
