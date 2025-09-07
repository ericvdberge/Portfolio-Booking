'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('homepage.hero');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {t('title')}
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('titleHighlight')}
                </span>
              </h1>
            </div>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              {t('subtitle')}
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/locations">
                <Button size="lg" className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  {t('exploreVenues')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-400 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-3"
              >
                {t('watchDemo')}
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-purple-600/20 p-3">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{t('premiumLocations')}</h3>
                <p className="text-xs text-slate-400">{t('premiumLocationsDesc')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-purple-600/20 p-3">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{t('instantBooking')}</h3>
                <p className="text-xs text-slate-400">{t('instantBookingDesc')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 rounded-full bg-purple-600/20 p-3">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{t('teamFocused')}</h3>
                <p className="text-xs text-slate-400">{t('teamFocusedDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}