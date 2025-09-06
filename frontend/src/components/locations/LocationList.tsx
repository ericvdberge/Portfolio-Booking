import { LocationCard } from './LocationCard';
import { LocationSkeleton } from './LocationSkeleton';
import { Location } from '@/types/location';
import { AlertCircle } from 'lucide-react';

interface LocationListProps {
  locations: Location[];
  isLoading?: boolean;
  error?: string;
  onBookNow?: (locationId: string) => void;
  onViewDetails?: (locationId: string) => void;
}

export function LocationList({ 
  locations, 
  isLoading = false, 
  error,
  onBookNow,
  onViewDetails
}: LocationListProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load locations</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <LocationSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📍</div>
        <h3 className="text-lg font-semibold mb-2">No locations found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or filters to find more locations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {locations.length} location{locations.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onBookNow={onBookNow}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}