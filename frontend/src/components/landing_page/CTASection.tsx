'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('homepage.cta');

  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 to-purple-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-white/90 text-sm">{t('rating')}</span>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('title')}
              <span className="block">{t('titleHighlight')}</span>
            </h2>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12">
            <Link href="/locations">
              <Button 
                size="lg" 
                className="group bg-white text-purple-700 hover:bg-slate-50 px-8 py-3 text-lg"
              >
                {t('startBrowsing')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              {t('scheduleDemo')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-purple-100">{t('stats.venues')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-purple-100">{t('stats.bookings')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-purple-100">{t('stats.support')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}