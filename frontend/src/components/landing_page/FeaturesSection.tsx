'use client';

import { Card, CardHeader, CardBody, Chip } from '@heroui/react';
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
        <p className="text-xl text-default-600">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.key} shadow="none" className="p-6 border border-default-200 hover:border-default-300 transition-colors">
              <CardHeader className="pb-4 px-0 flex-col items-start">
                <div className="flex items-start justify-between w-full mb-3">
                  <div className="rounded-xl bg-accent p-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <Chip variant="flat" color="primary" size="sm">
                    {t(`${feature.key}.badge`)}
                  </Chip>
                </div>
                <h3 className="text-lg font-semibold text-left w-full">{t(`${feature.key}.title`)}</h3>
              </CardHeader>
              <CardBody className="pt-0 px-0">
                <p className="text-default-600 text-sm leading-relaxed">
                  {t(`${feature.key}.description`)}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="bg-default-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold">
            {t('amenities.title')}
          </h3>
          <p className="text-lg md:text-xl text-default-600 max-w-2xl mx-auto">
            {t('amenities.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {amenities.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <div key={amenity.key} className="flex flex-col items-center text-center space-y-3 min-w-[100px]">
                <div className="rounded-full bg-white p-5 border border-default-200">
                  <IconComponent className="h-7 w-7 text-default-700" />
                </div>
                <span className="text-sm font-medium text-default-700">{t(`amenities.${amenity.key}`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}