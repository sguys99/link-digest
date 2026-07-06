import { LinkCardSkeletonList } from '@/components/dashboard/link-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

// (auth) 세그먼트 공통 폴백. 레이아웃(<main>) 안쪽 페이지 영역에 렌더되어
// 서버에서 데이터를 prefetch하는 동안 즉시 골격을 노출한다(빈 화면 제거).
export default function Loading() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="h-6 w-24" />
      <LinkCardSkeletonList />
    </div>
  )
}
