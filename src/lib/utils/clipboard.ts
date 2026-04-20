import { addLinkFormSchema } from '@/lib/validators/link'

const MAX_URL_LENGTH = 2048

export type ParseClipboardUrlResult =
  | { ok: true; url: string }
  | { ok: false }

export function parseClipboardUrl(raw: string): ParseClipboardUrlResult {
  if (!raw) return { ok: false }
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LENGTH) {
    return { ok: false }
  }
  const result = addLinkFormSchema.safeParse({ url: trimmed })
  if (!result.success) return { ok: false }
  return { ok: true, url: result.data.url }
}
