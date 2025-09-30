'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetLocationById } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function LocationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locationId = params.id as string;

  const { data: location, isLoading, error } = useGetLocationById({ 
    pathParams: { id: locationId }
  });

  const getImage = () => {
    if (!location?.id) return '/greece1.jpg';
    
    const hash = location.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    const imageNumber = Math.abs(hash % 3) + 1;
    return `/greece${imageNumber}.jpg`;
  };

  const handleBookNow = () => {
    console.log('Book location:', locationId);
    alert(t('locationDetails.bookingComingSoon', { locationId }));
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t('locationDetails.notFound')}</h1>
          <p className="text-muted-foreground">
            {t('locationDetails.notFoundDescription')}
          </p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('locationDetails.goBack')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleGoBack} 
          variant="outline" 
          size="sm"
          className="shrink-0 border-none shadow-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{location.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
              {location.address}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image and Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Image
              src={getImage()}
              alt={`${location.name} location`}
              width={800}
              height={400}
              priority
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
            />
          </div>

          <Card className="shadow-none border-none pl-0">
            <CardHeader className="pl-0">
              <CardTitle>{t('locationDetails.aboutLocation')}</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <p className="text-muted-foreground leading-relaxed">
                {location.description || t('locationDetails.noDescription')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Information */}
        <div className="space-y-6">
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>{t('locationDetails.details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">{t('locationDetails.capacity')}</span>
                </div>
                <Badge variant="secondary">{location.capacity} {t('locationDetails.people')}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">{t('locationDetails.hours')}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {location.openTime} - {location.closeTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">{t('locationDetails.availability')}</span>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {t('locationDetails.available')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>{t('locationDetails.bookTitle')}</CardTitle>
              <CardDescription>
                {t('locationDetails.bookDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleBookNow}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('locationDetails.bookNow')}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>{t('locationDetails.features')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('locationDetails.feature1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('locationDetails.feature2')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('locationDetails.feature3')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('locationDetails.feature4')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}