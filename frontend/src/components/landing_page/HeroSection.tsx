'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('homepage.hero');

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-24 space-y-12 sm:space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-block mb-2 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-medium">
              HeroUI
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {t('title')}
              <span className="block text-primary">
                {t('titleHighlight')}
              </span>
            </h1>

            <p className="max-w-2xl text-base text-default-600 sm:text-lg md:text-xl">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
            <Link href="/locations" data-testid="hero-explore-venues-link" className="w-full sm:w-auto">
              <Button size="lg" color="primary" className="group px-6 sm:px-8 py-3 w-full sm:w-auto">
                {t('exploreVenues')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="bordered"
              size="lg"
              className="px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              {t('watchDemo')}
            </Button>
          </div>
        </div>

        <div className="relative order-first lg:order-last">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/greece1.jpg"
              alt="Beautiful venue location"
              width={600}
              height={400}
              priority
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div className="rounded-full bg-default-100 p-3 sm:p-4">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold">{t('premiumLocations')}</h3>
            <p className="text-xs sm:text-sm text-default-500">{t('premiumLocationsDesc')}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div className="rounded-full bg-default-100 p-3 sm:p-4">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold">{t('instantBooking')}</h3>
            <p className="text-xs sm:text-sm text-default-500">{t('instantBookingDesc')}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div className="rounded-full bg-default-100 p-3 sm:p-4">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold">{t('teamFocused')}</h3>
            <p className="text-xs sm:text-sm text-default-500">{t('teamFocusedDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}