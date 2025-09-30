'use client';

import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useGetAllLocations } from '@/api/client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LocationsPage() {
const { data: locations, isLoading, error } = useGetAllLocations({});
  const t = useTranslations('locations');
  const router = useRouter();

  const handleBookNow = (locationId: string) => {
    alert(`Booking functionality for location ${locationId} will be implemented soon!`);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
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