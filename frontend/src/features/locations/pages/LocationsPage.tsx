'use client';

import { Suspense } from 'react';
import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useSuspenseGetAllLocations, LocationType, getAllLocationsQuery } from '@/api/client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chip } from '@heroui/react';
import { useState, useEffect } from 'react';
import { parseLocationTypeFromQuery, buildLocationTypeUrl } from '@/features/locations/utils/locationTypeUtils';
import { LocationSkeleton } from '@/features/locations/components/LocationSkeleton';
import { useQueryClient } from '@/providers/query-provider';

function LocationsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <LocationSkeleton key={i} />
      ))}
    </div>
  );
}

function LocationsPageContent({ selectedLocationType }: { selectedLocationType: LocationType | null }) {
  // Only include locationType in queryParams if a specific type is selected
  const queryParams = selectedLocationType !== null ? { locationType: selectedLocationType } : {};

  const { data: locations } = useSuspenseGetAllLocations({
    queryParams,
  });
  const t = useTranslations('locations');
  const router = useRouter();

  const handleBookNow = (locationId: string) => {
    alert(`Booking functionality for location ${locationId} will be implemented soon!`);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  return (
    <LocationGrid
      locations={locations ?? []}
      onBookNow={handleBookNow}
      onViewDetails={handleViewDetails}
    />
  );
}

export default function LocationsPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const t = useTranslations('locations');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize state from URL query param using automatic enum conversion
  const getInitialType = (): LocationType | null => {
    return parseLocationTypeFromQuery(typeParam);
  };

  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | null>(getInitialType());

  // Update state when URL query param changes
  useEffect(() => {
    const newType = getInitialType();
    setSelectedLocationType(newType);
  }, [typeParam]);

  const handleFilterClick = (type: LocationType | null) => {
    setSelectedLocationType(type);
    router.push(buildLocationTypeUrl(type));
  };

  // Prefetch data when hovering over filter chips
  const handleFilterHover = (type: LocationType | null) => {
    const queryParams = type !== null ? { locationType: type } : {};
    queryClient.prefetchQuery(
      getAllLocationsQuery({ queryParams })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="locations-page-heading">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Chip
          variant={selectedLocationType === null ? 'solid' : 'flat'}
          color={selectedLocationType === null ? 'primary' : 'default'}
          onClick={() => handleFilterClick(null)}
          onMouseEnter={() => handleFilterHover(null)}
          className="cursor-pointer"
        >
          All Locations
        </Chip>
        <Chip
          variant={selectedLocationType === LocationType.Hotel ? 'solid' : 'flat'}
          color={selectedLocationType === LocationType.Hotel ? 'primary' : 'default'}
          onClick={() => handleFilterClick(LocationType.Hotel)}
          onMouseEnter={() => handleFilterHover(LocationType.Hotel)}
          className="cursor-pointer"
        >
          Hotel
        </Chip>
        <Chip
          variant={selectedLocationType === LocationType.BAndB ? 'solid' : 'flat'}
          color={selectedLocationType === LocationType.BAndB ? 'primary' : 'default'}
          onClick={() => handleFilterClick(LocationType.BAndB)}
          onMouseEnter={() => handleFilterHover(LocationType.BAndB)}
          className="cursor-pointer"
        >
          B&amp;B
        </Chip>
      </div>

      <Suspense fallback={<LocationsGridSkeleton />}>
        <LocationsPageContent selectedLocationType={selectedLocationType} />
      </Suspense>
    </div>
  );
}
