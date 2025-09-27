'use client';

import { LocationDto } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      className={`w-full hover:shadow-lg transition-all duration-300 ease-out py-0 pb-4 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-2'
      }`} 
      onClick={handleViewDetails}
    > 
      <div className="relative w-full h-48 bg-slate-200 rounded-t-lg overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-t-lg" />
        )}
        <Image 
          src={imageError ? '/greece1.jpg' : getImage()} 
          alt={`${location.name} location`}
          fill
          className="object-cover rounded-t-lg"
          onError={handleImageError}
          onLoad={handleImageLoad}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <MapPin className="h-5 w-5" /> */}
          {location.name}
        </CardTitle>
        <CardDescription className='text-sm'>
          {location.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{t('locationCard.capacity')}: {location.capacity}</span>
          </div>
          <Badge variant="secondary">{t('locationCard.available')}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{location.openTime} - {location.closeTime}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleBookNow}
            className="flex-1"
          >
            {t('locationCard.bookNow')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}