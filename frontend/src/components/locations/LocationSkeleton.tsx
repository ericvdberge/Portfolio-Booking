import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LocationSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full rounded-t-lg" />
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-3">
          {/* Title and price */}
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-8" />
          </div>

          {/* Address */}
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Rating and availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-18" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-x-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </CardFooter>
    </Card>
  );
}