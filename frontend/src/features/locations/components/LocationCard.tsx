'use client';

import { LocationDto, LocationType } from '@/api/client';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react';
import { MapPin, Users, Clock, Hotel, Home, Building } from 'lucide-react';
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

  const getLocationTypeInfo = () => {
    switch (location.locationType) {
      case LocationType.Hotel:
        return { label: 'Hotel', color: 'primary' as const, icon: <Hotel className="h-3 w-3" /> };
      case LocationType.BAndB:
        return { label: 'B&B', color: 'secondary' as const, icon: <Home className="h-3 w-3" /> };
      default:
        return { label: 'Venue', color: 'default' as const, icon: <Building className="h-3 w-3" /> };
    }
  };

  const locationTypeInfo = getLocationTypeInfo();

  return (
    <Card
      isPressable
      onPress={handleViewDetails}
      data-testid="location-card"
      className={`w-full transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2'
      }`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-40 sm:h-48 bg-default-100 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-default-100 animate-pulse" />
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
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <Chip
              color={locationTypeInfo.color}
              variant="flat"
              size="sm"
              startContent={locationTypeInfo.icon}
              className="backdrop-blur-sm bg-background/80"
              data-testid="location-card-type"
            >
              {locationTypeInfo.label}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-2 sm:space-y-3 p-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold line-clamp-1" data-testid="location-card-name">{location.name}</h3>
          <p className="text-xs sm:text-sm text-default-500 line-clamp-1" data-testid="location-card-address">{location.address}</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm" data-testid="location-card-capacity">{t('locationCard.capacity')}: {location.capacity}</span>
          </div>
          <Chip color="success" variant="flat" size="sm" className="text-xs">{t('locationCard.available')}</Chip>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-default-500">
          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span data-testid="location-card-hours">{location.openTime} - {location.closeTime}</span>
        </div>
      </CardBody>
      <CardFooter className="pt-0 px-4 pb-4">
        <Button
          size="sm"
          color="primary"
          onPress={handleBookNow}
          data-testid="location-card-book-now"
          className="w-full text-sm sm:text-base"
        >
          {t('locationCard.bookNow')}
        </Button>
      </CardFooter>
    </Card>
  );
}