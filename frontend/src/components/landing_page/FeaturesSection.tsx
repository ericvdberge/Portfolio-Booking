'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CreditCard, Headphones, Wifi, Coffee, Presentation } from 'lucide-react';
import { useTranslations } from 'next-intl';

const getFeatures = (t: any) => [
  {
    icon: Shield,
    key: 'secureBooking'
  },
  {
    icon: Clock,
    key: 'availability'
  },
  {
    icon: CreditCard,
    key: 'flexiblePayment'
  },
  {
    icon: Headphones,
    key: 'premiumSupport'
  }
];

const getAmenities = (t: any) => [
  { icon: Wifi, key: 'wifi' },
  { icon: Coffee, key: 'refreshments' },
  { icon: Presentation, key: 'avEquipment' },
];

export function FeaturesSection() {
  const t = useTranslations('homepage.features');
  const features = getFeatures(t);
  const amenities = getAmenities(t);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const featureData = t(`${feature.key}`);
            return (
              <Card key={feature.key} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {t(`${feature.key}.badge`)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{t(`${feature.key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {t(`${feature.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {t('amenities.title')}
            </h3>
            <p className="text-slate-600">
              {t('amenities.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {amenities.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div key={amenity.key} className="flex flex-col items-center text-center">
                  <div className="mb-3 rounded-full bg-slate-100 p-4">
                    <IconComponent className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{t(`amenities.${amenity.key}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}