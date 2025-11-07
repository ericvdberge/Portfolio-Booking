'use client';

import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useGetAllLocations, LocationType } from '@/api/client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chip } from '@heroui/react';
import { useState, useEffect } from 'react';
import { parseLocationTypeFromQuery } from '@/utils/locationTypeUtils';

export default function LocationsPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

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

  // Only include locationType in queryParams if a specific type is selected
  const queryParams = selectedLocationType !== null ? { locationType: selectedLocationType } : {};

  const { data: locations, isLoading, error } = useGetAllLocations({
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

  const handleFilterClick = (type: LocationType | null) => {
    setSelectedLocationType(type);
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
          className="cursor-pointer"
        >
          All Locations
        </Chip>
        <Chip
          variant={selectedLocationType === LocationType.Hotel ? 'solid' : 'flat'}
          color={selectedLocationType === LocationType.Hotel ? 'primary' : 'default'}
          onClick={() => handleFilterClick(LocationType.Hotel)}
          className="cursor-pointer"
        >
          Hotel
        </Chip>
        <Chip
          variant={selectedLocationType === LocationType.BAndB ? 'solid' : 'flat'}
          color={selectedLocationType === LocationType.BAndB ? 'primary' : 'default'}
          onClick={() => handleFilterClick(LocationType.BAndB)}
          className="cursor-pointer"
        >
          B&amp;B
        </Chip>
      </div>

      <LocationGrid
        locations={locations ?? []}
        isLoading={isLoading}
        error={error?.payload}
        onBookNow={handleBookNow}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
