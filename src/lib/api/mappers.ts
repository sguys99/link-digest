import type { Link, ContentType, LinkStatus } from "@/types";

/** Supabase 응답(snake_case)을 Link 타입(camelCase)으로 변환 */
export function toLinkResponse(row: Record<string, unknown>): Link {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    url: row.url as string,
    title: (row.title as string) ?? null,
    thumbnailUrl: (row.thumbnail_url as string) ?? null,
    contentType: row.content_type as ContentType,
    oneLineSummary: (row.one_line_summary as string) ?? null,
    keyPoints: (row.key_points as string[]) ?? null,
    estimatedReadTime: (row.estimated_read_time as number) ?? null,
    status: row.status as LinkStatus,
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
