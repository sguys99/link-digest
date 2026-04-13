import { z } from "zod";

// POST /api/links 요청 바디
export const createLinkSchema = z.object({
  url: z
    .url({ message: "유효한 URL 형식이 아닙니다." })
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      message: "HTTP 또는 HTTPS URL만 허용됩니다.",
    }),
  title: z.string().max(500).optional(),
});

// PATCH /api/links/[id] 요청 바디
export const updateLinkSchema = z.object({
  isRead: z.boolean().optional(),
});

// GET /api/links 쿼리 파라미터
export const listLinksQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z
    .enum(["pending", "completed", "summary_pending", "llm_failed", "crawl_failed"])
    .optional(),
  isRead: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

// 클라이언트 폼용 (URL 입력만)
export const addLinkFormSchema = z.object({
  url: z
    .url({ message: '유효한 URL 형식이 아닙니다.' })
    .refine((val) => val.startsWith('http://') || val.startsWith('https://'), {
      message: 'HTTP 또는 HTTPS URL만 허용됩니다.',
    }),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ListLinksQuery = z.infer<typeof listLinksQuerySchema>;
export type AddLinkFormInput = z.infer<typeof addLinkFormSchema>;
