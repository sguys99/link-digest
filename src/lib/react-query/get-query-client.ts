import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 프리페치 후 하이드레이션 직후 곧바로 refetch되는 것을 방지
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // pending 쿼리도 dehydrate에 포함(스트리밍 프리페치 지원)
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

/**
 * 서버: 요청마다 새 QueryClient(요청 간 상태 누수 방지).
 * 브라우저: 싱글턴(초기 렌더 중 suspend되어도 재생성하지 않음).
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
