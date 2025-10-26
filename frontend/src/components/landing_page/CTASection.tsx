'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('homepage.cta');

  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 to-teal-900 border border-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <Image
            src="/greece2.jpg"
            alt="Beautiful venue"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative p-8 md:p-12 lg:p-16">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-white/90 text-sm font-medium">{t('rating')}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {t('title')}
                <span className="block text-teal-100 mt-2">{t('titleHighlight')}</span>
              </h2>

              <p className="text-lg text-teal-50 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Link href="/locations" data-testid="cta-start-browsing-link">
                <Button
                  size="lg"
                  className="group bg-white text-teal-700 hover:bg-teal-50 font-semibold"
                >
                  {t('startBrowsing')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6">
              <div className="text-center space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                <div className="text-teal-100 text-xs md:text-sm">{t('stats.venues')}</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-white">50K+</div>
                <div className="text-teal-100 text-xs md:text-sm">{t('stats.bookings')}</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="text-teal-100 text-xs md:text-sm">{t('stats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}