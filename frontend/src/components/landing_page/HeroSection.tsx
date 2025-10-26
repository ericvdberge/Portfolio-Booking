'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('homepage.hero');

  return (
    <section className="container mx-auto px-4 py-24 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-block mb-4 px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium">
              HeroUI
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('title')}
              <span className="block text-primary">
                {t('titleHighlight')}
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-default-600 sm:text-xl">
              {t('subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/locations" data-testid="hero-explore-venues-link">
              <Button size="lg" color="primary" className="group px-8 py-3">
                {t('exploreVenues')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="bordered"
              size="lg"
              className="px-8 py-3"
            >
              {t('watchDemo')}
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/greece1.jpg"
              alt="Beautiful venue location"
              width={600}
              height={400}
              priority
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="rounded-full bg-default-100 p-4">
            <MapPin className="h-6 w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{t('premiumLocations')}</h3>
            <p className="text-sm text-default-500">{t('premiumLocationsDesc')}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="rounded-full bg-default-100 p-4">
            <Calendar className="h-6 w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{t('instantBooking')}</h3>
            <p className="text-sm text-default-500">{t('instantBookingDesc')}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="rounded-full bg-default-100 p-4">
            <Users className="h-6 w-6 text-default-700" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{t('teamFocused')}</h3>
            <p className="text-sm text-default-500">{t('teamFocusedDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}