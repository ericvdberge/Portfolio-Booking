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
    <section className="container mx-auto px-4 py-20 space-y-20">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h2>
        <p className="text-xl text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.key} className="shadow-none border-none p-6 hover:bg-slate-50 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl bg-purple-100 p-3">
                    <IconComponent className="h-7 w-7 text-purple-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t(`${feature.key}.badge`)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{t(`${feature.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {t(`${feature.key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-3xl p-12">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-3xl font-bold">
            {t('amenities.title')}
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('amenities.subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {amenities.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <div key={amenity.key} className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-white p-6 shadow-sm">
                  <IconComponent className="h-8 w-8 text-slate-700" />
                </div>
                <span className="text-base font-medium">{t(`amenities.${amenity.key}`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}