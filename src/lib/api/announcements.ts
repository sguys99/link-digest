import type { Announcement, PaginatedResponse } from "@/types";
import { handleResponse } from "./fetch-utils";

type GetAnnouncementsParams = {
  cursor?: string;
  limit?: number;
};

type CreateAnnouncementInput = {
  title: string;
  content: string;
};

type UpdateAnnouncementInput = {
  title?: string;
  content?: string;
  isPublished?: boolean;
};

export async function getAnnouncements(
  params: GetAnnouncementsParams = {},
): Promise<PaginatedResponse<Announcement>> {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const res = await fetch(`/api/announcements${query ? `?${query}` : ""}`);
  return handleResponse<PaginatedResponse<Announcement>>(res);
}

export async function getAnnouncement(id: string): Promise<Announcement> {
  const res = await fetch(`/api/announcements/${id}`);
  return handleResponse<Announcement>(res);
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<Announcement> {
  const res = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Announcement>(res);
}

export async function updateAnnouncement(
  id: string,
  input: UpdateAnnouncementInput,
): Promise<Announcement> {
  const res = await fetch(`/api/announcements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Announcement>(res);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body?.error?.message ?? `삭제에 실패했습니다. (${res.status})`;
    throw new Error(message);
  }
}
