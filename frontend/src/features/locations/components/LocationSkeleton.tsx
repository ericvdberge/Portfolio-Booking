export function LocationSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
      </div>
    </div>
  );
}