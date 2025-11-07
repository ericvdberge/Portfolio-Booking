'use client';

import Link from 'next/link';
import { Card, CardBody, Chip } from '@heroui/react';
import { Hotel, Home, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LocationType } from '@/api/client';
import { buildLocationTypeUrl } from '@/features/locations/utils/locationTypeUtils';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  href: string;
  color: 'primary' | 'secondary' | 'success';
}

function CategoryCard({ icon, title, description, count, href, color }: CategoryCardProps) {
  return (
    <Link href={href} className="w-full" data-testid={`category-card-${title.toLowerCase()}`}>
      <Card
        isPressable
        isHoverable
        className="w-full h-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <CardBody className="gap-4 p-6">
          <div className="flex items-start justify-between">
            <div className={`rounded-xl bg-${color}-50 p-3 text-${color}-600`}>
              {icon}
            </div>
            {count !== undefined && (
              <Chip size="sm" variant="flat" color={color}>
                {count}+
              </Chip>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-default-500">{description}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-primary group">
            <span>Browse</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export function CategorySection() {
  const t = useTranslations('homepage.categories');

  const categories = [
    {
      icon: <Hotel className="h-6 w-6" />,
      title: t('hotel.title'),
      description: t('hotel.description'),
      count: 15,
      href: buildLocationTypeUrl(LocationType.Hotel),
      color: 'primary' as const,
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: t('bnb.title'),
      description: t('bnb.description'),
      count: 8,
      href: buildLocationTypeUrl(LocationType.BAndB),
      color: 'secondary' as const,
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('all.title'),
      description: t('all.description'),
      count: 25,
      href: buildLocationTypeUrl(null),
      color: 'success' as const,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-default-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
