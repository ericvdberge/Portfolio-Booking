'use client';

import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useGetAllLocations } from '@/api/client';
import { LocationType } from '@/api/api-types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Select, SelectItem } from '@heroui/react';
import { useState } from 'react';

export default function LocationsPage() {
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | undefined>(undefined);
  const { data: locations, isLoading, error } = useGetAllLocations({
    locationType: selectedLocationType,
  });
  const t = useTranslations('locations');
  const router = useRouter();

  const handleBookNow = (locationId: string) => {
    alert(`Booking functionality for location ${locationId} will be implemented soon!`);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  const handleLocationTypeChange = (value: string) => {
    if (value === 'all') {
      setSelectedLocationType(undefined);
    } else {
      setSelectedLocationType(Number(value) as LocationType);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="locations-page-heading">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex justify-start">
        <Select
          label="Filter by Location Type"
          placeholder="All Locations"
          className="max-w-xs"
          selectedKeys={selectedLocationType !== undefined ? [String(selectedLocationType)] : ['all']}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            handleLocationTypeChange(value);
          }}
        >
          <SelectItem key="all" value="all">
            All Locations
          </SelectItem>
          <SelectItem key={String(LocationType.Hotel)} value={String(LocationType.Hotel)}>
            Hotel
          </SelectItem>
          <SelectItem key={String(LocationType.BAndB)} value={String(LocationType.BAndB)}>
            B&amp;B
          </SelectItem>
        </Select>
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
