import type { Link, LinkStatus, PaginatedResponse } from '@/types'
import { handleResponse } from './fetch-utils'

type GetLinksParams = {
  cursor?: string
  limit?: number
  status?: LinkStatus
  isRead?: boolean
}

type CreateLinkInput = {
  url: string
  title?: string
}

type UpdateLinkInput = {
  isRead?: boolean
}

export async function getLinks(
  params: GetLinksParams = {}
): Promise<PaginatedResponse<Link>> {
  const searchParams = new URLSearchParams()
  if (params.cursor) searchParams.set('cursor', params.cursor)
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  if (params.isRead !== undefined)
    searchParams.set('isRead', String(params.isRead))

  const query = searchParams.toString()
  const res = await fetch(`/api/links${query ? `?${query}` : ''}`)
  return handleResponse<PaginatedResponse<Link>>(res)
}

export async function createLink(input: CreateLinkInput): Promise<Link> {
  const res = await fetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return handleResponse<Link>(res)
}

export async function updateLink(
  id: string,
  input: UpdateLinkInput
): Promise<Link> {
  const res = await fetch(`/api/links/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return handleResponse<Link>(res)
}

export async function deleteLink(id: string): Promise<void> {
  const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message =
      body?.error?.message ?? `삭제에 실패했습니다. (${res.status})`
    throw new Error(message)
  }
}
