'use client';

import { LocationDto } from '@/api/client';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react';
import { MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface LocationCardProps {
  location: LocationDto;
  onBookNow?: (locationId: string) => void;
  onViewDetails?: (locationId: string) => void;
  delay?: number;
}

export function LocationCard({ location, onBookNow, onViewDetails, delay = 0 }: LocationCardProps) {
  const t = useTranslations();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  const handleBookNow = () => {
    onBookNow?.(location.id || '');
  };

  const handleViewDetails = () => {
    onViewDetails?.(location.id || '');
  };

  const getImage = () => {
    if (!location?.id) return '/greece1.jpg';
    
    const hash = location.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    const imageNumber = Math.abs(hash % 3) + 1;
    return `/greece${imageNumber}.jpg`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <Card
      isPressable
      onPress={handleViewDetails}
      className={`w-full transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2'
      }`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}
          <Image
            src={imageError ? '/greece1.jpg' : getImage()}
            alt={`${location.name} location`}
            fill
            className="object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{location.name}</h3>
          <p className="text-sm text-default-500">{location.address}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{t('locationCard.capacity')}: {location.capacity}</span>
          </div>
          <Chip color="success" variant="flat" size="sm">{t('locationCard.available')}</Chip>
        </div>

        <div className="flex items-center gap-2 text-sm text-default-500">
          <Clock className="h-4 w-4" />
          <span>{location.openTime} - {location.closeTime}</span>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          size="sm"
          color="primary"
          onPress={handleBookNow}
          className="w-full"
        >
          {t('locationCard.bookNow')}
        </Button>
      </CardFooter>
    </Card>
  );
}