'use client';

import { Suspense } from 'react';
import { LocationGrid } from '@/features/locations/components/LocationGrid';
import { useSuspenseGetAllLocations, getAllLocationsQuery } from '@/api/client';
import { LocationSkeleton } from '@/features/locations/components/LocationSkeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@/providers/query-provider';

function FeaturedLocationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <LocationSkeleton key={i} />
      ))}
    </div>
  );
}

function FeaturedLocationsContent() {
  const router = useRouter();
  const { data: locations } = useSuspenseGetAllLocations({ queryParams: { limit: 3 } });

  const handleBookNow = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/locations/${locationId}`);
  };

  return (
    <LocationGrid
      locations={locations || []}
      onBookNow={handleBookNow}
      onViewDetails={handleViewDetails}
    />
  );
}

export function FeaturedLocationsSection() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  // Prefetch all locations when hovering over the "View All" link
  const handlePrefetchAllLocations = () => {
    queryClient.prefetchQuery(
      getAllLocationsQuery({ queryParams: {} })
    );
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
          <Suspense fallback={<FeaturedLocationsSkeleton />}>
            <FeaturedLocationsContent />
          </Suspense>
        </div>

        <div className="text-center">
          <Link
            href="/locations"
            onMouseEnter={handlePrefetchAllLocations}
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