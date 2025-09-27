'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CTASection() {
  const t = useTranslations('homepage.cta');

  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <Image
            src="/greece2.jpg"
            alt="Beautiful venue"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative p-12 lg:p-20">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-white/90 text-sm">{t('rating')}</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t('title')}
                <span className="block text-purple-200">{t('titleHighlight')}</span>
              </h2>
              
              <p className="text-xl text-purple-100 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/locations">
                <Button 
                  size="lg" 
                  className="group bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg"
                >
                  {t('startBrowsing')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-purple-200 text-sm">{t('stats.venues')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-purple-200 text-sm">{t('stats.bookings')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-purple-200 text-sm">{t('stats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}