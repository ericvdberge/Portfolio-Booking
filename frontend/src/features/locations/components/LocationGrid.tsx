import { LocationDto } from '@/api/client';
import { LocationCard } from './LocationCard';
import { LocationSkeleton } from './LocationSkeleton';

interface LocationGridProps {
  locations: LocationDto[];
  isLoading?: boolean;
  error?: string;
  onBookNow?: (locationId: string) => void;
  onViewDetails?: (locationId: string) => void;
  skeletonCount?: number;
}

export function LocationGrid({
  locations,
  isLoading = false,
  error,
  onBookNow,
  onViewDetails,
  skeletonCount = 6
}: LocationGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center" data-testid="locations-loading">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <LocationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4" data-testid="locations-error">
        <h1 className="text-2xl font-bold text-destructive">Error Loading Locations</h1>
        <p className="text-muted-foreground">Unable to fetch locations. Please try again later.</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center space-y-4 py-12" data-testid="locations-empty">
        <h2 className="text-xl font-semibold">No Locations Available</h2>
        <p className="text-muted-foreground">There are currently no locations available for booking.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center" data-testid="locations-grid">
      {locations.map((location, index) => (
        <LocationCard
          key={location.id}
          location={location}
          onBookNow={onBookNow}
          onViewDetails={onViewDetails}
          delay={0}
        />
      ))}
    </div>
  );
}