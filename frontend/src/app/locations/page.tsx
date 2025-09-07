'use client';

import { LocationList } from '@/features/locations/components/LocationList';
import { useGetAllLocations } from '@/api/client';

export default function LocationsPage() {
  const { data: locations, isLoading, error } = useGetAllLocations({});

  const handleBookNow = (locationId: string) => {
    console.log('Book location:', locationId);
    alert(`Booking functionality for location ${locationId} will be implemented soon!`);
  };

  const handleViewDetails = (locationId: string) => {
    console.log('View details for location:', locationId);
    alert(`Location details for ${locationId} will be implemented soon!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Space</h1>
        <p className="text-muted-foreground">
          Discover and book amazing venues for your meetings, events, and workspace needs.
        </p>
      </div>

      <LocationList
        locations={locations ?? []}
        isLoading={isLoading}
        error={error?.payload}
        onBookNow={handleBookNow}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}