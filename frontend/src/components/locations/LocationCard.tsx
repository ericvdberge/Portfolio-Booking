'use client';

import { MapPin, Star, Clock, Wifi, Coffee, Car, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Location, LocationCategory, PriceRange } from '@/types/location';

interface LocationCardProps {
  location: Location;
  onBookNow?: (locationId: string) => void;
  onViewDetails?: (locationId: string) => void;
}

const categoryLabels: Record<LocationCategory, string> = {
  [LocationCategory.CONFERENCE_ROOM]: 'Conference Room',
  [LocationCategory.OFFICE_SPACE]: 'Office Space',
  [LocationCategory.EVENT_HALL]: 'Event Hall',
  [LocationCategory.COWORKING]: 'Co-working',
  [LocationCategory.MEETING_ROOM]: 'Meeting Room',
  [LocationCategory.STUDIO]: 'Studio',
  [LocationCategory.OTHER]: 'Other',
};

const priceRangeLabels: Record<PriceRange, string> = {
  [PriceRange.BUDGET]: '$',
  [PriceRange.MODERATE]: '$$',
  [PriceRange.PREMIUM]: '$$$',
  [PriceRange.LUXURY]: '$$$$',
};

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  coffee: Coffee,
  parking: Car,
  meeting: Users,
};

export function LocationCard({ location, onBookNow, onViewDetails }: LocationCardProps) {
  const handleBookNow = () => {
    onBookNow?.(location.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(location.id);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {location.imageUrl ? (
          <div className="relative h-48 w-full">
            <img
              src={location.imageUrl}
              alt={location.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90">
                {categoryLabels[location.category]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 rounded-t-lg flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2">{location.name}</h3>
            <span className="text-sm font-medium text-primary">
              {priceRangeLabels[location.priceRange]}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {location.address}, {location.city}, {location.state}
            </span>
          </div>

          {location.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {location.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {location.rating && (
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{location.rating}</span>
                {location.reviewCount && (
                  <span className="text-muted-foreground ml-1">
                    ({location.reviewCount})
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Available today</span>
            </div>
          </div>

          {location.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {location.amenities.slice(0, 4).map((amenity) => {
                const IconComponent = amenityIcons[amenity.toLowerCase()];
                return (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    {IconComponent && <IconComponent className="h-3 w-3" />}
                    {amenity}
                  </Badge>
                );
              })}
              {location.amenities.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{location.amenities.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleBookNow}
          disabled={!location.isActive}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}