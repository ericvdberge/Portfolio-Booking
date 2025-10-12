'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetLocationById } from '@/api/client';
import { Button, Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { ArrowLeft, Users, Clock, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageCollage } from '../components/ImageCollage';
import { getLocationImages } from '../utils/getLocationImages';

export default function LocationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locationId = params.id as string;

  const { data: location, isLoading, error } = useGetLocationById({
    pathParams: { id: locationId }
  });

  // Generate multiple images for the collage
  const images = getLocationImages(location?.id, 4);

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
          <Button onPress={handleGoBack} variant="bordered">
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
          onPress={handleGoBack}
          variant="light"
          size="sm"
          isIconOnly
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
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
          <ImageCollage images={images} locationName={location.name} />

          <Card shadow="none" className="border-none pl-0">
            <CardHeader className="pl-0">
              <h2 className="text-xl font-semibold">{t('locationDetails.aboutLocation')}</h2>
            </CardHeader>
            <CardBody className="pl-0">
              <p className="text-default-500 leading-relaxed">
                {location.description || t('locationDetails.noDescription')}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Booking Information */}
        <div className="space-y-6">
          <Card shadow="none" className="border-none">
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('locationDetails.details')}</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm text-default-500">{t('locationDetails.capacity')}</span>
                </div>
                <Chip variant="flat" color="default">{location.capacity} {t('locationDetails.people')}</Chip>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm text-default-500">{t('locationDetails.hours')}</span>
                </div>
                <span className="text-sm text-default-500">
                  {location.openTime} - {location.closeTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-default-500">{t('locationDetails.availability')}</span>
                </div>
                <Chip color="success" variant="flat">
                  {t('locationDetails.available')}
                </Chip>
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" className="border-none">
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold">{t('locationDetails.bookTitle')}</h2>
                <p className="text-sm text-default-500">
                  {t('locationDetails.bookDescription')}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Button
                onPress={handleBookNow}
                color="primary"
                className="w-full"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('locationDetails.bookNow')}
              </Button>
            </CardBody>
          </Card>

          <Card shadow="none" className="border-none">
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('locationDetails.features')}</h2>
            </CardHeader>
            <CardBody>
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
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}