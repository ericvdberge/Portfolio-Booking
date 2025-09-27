'use client';

import { LocationCard } from '@/features/locations/components/LocationCard';
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('featuredLocations.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('featuredLocations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{t('featuredLocations.errorLoading')}</p>
            </div>
          ) : locations && locations.length > 0 ? (
            locations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                onBookNow={handleBookNow}
                onViewDetails={handleViewDetails}
                delay={index * 100}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{t('featuredLocations.noLocations')}</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/locations"
            className="group inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-lg font-medium"
          >
            {t('featuredLocations.viewAllLocations')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}