'use client';

import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useGetAllLocations } from '@/api/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FeaturedLocationsSection() {
  const router = useRouter();
  const t = useTranslations();
  const { data: locations, isLoading, error } = useGetAllLocations({ queryParams: { limit: 3 } });

  const handleBookNow = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  return (
    <section className="py-16 bg-default-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('featuredLocations.title')}
          </h2>
          <p className="text-lg text-default-600">
            {t('featuredLocations.subtitle')}
          </p>
        </div>

        <div className="pb-8">
          <LocationGrid
            locations={locations || []}
            isLoading={isLoading}
            error={error?.payload}
            onBookNow={handleBookNow}
            onViewDetails={handleViewDetails}
            skeletonCount={3}
          />
        </div>

        <div className="text-center">
          <Link
            href="/locations"
            className="group inline-flex items-center gap-2 text-default-700 hover:text-foreground transition-colors text-lg font-medium"
          >
            {t('featuredLocations.viewAllLocations')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}