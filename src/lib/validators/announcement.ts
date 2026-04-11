import { z } from "zod";

// POST /api/announcements 요청 바디
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").max(200, "제목은 200자 이내로 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요.").max(10000, "내용은 10000자 이내로 입력해주세요."),
});

// PATCH /api/announcements/[id] 요청 바디
export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/announcements 쿼리 파라미터
export const listAnnouncementsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQuerySchema>;
