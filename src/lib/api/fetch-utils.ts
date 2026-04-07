/** 공통 fetch 응답 처리: 에러 시 message 추출 후 throw */
export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body?.error?.message ?? `요청에 실패했습니다. (${res.status})`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}
