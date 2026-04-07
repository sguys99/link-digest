import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LinkCardSkeleton() {
  return (
    <Card className="gap-3 py-3">
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="mt-1.5 h-3.5 w-2/3" />
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="ml-auto h-3.5 w-10" />
      </CardFooter>
    </Card>
  )
}

export function LinkCardSkeletonList() {
  return (
    <div className="space-y-3">
      <LinkCardSkeleton />
      <LinkCardSkeleton />
      <LinkCardSkeleton />
    </div>
  )
}
