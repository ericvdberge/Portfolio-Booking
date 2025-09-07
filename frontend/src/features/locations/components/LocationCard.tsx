'use client';

import { LocationDto } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock } from 'lucide-react';

interface LocationCardProps {
  location: LocationDto;
  onBookNow?: (locationId: string) => void;
  onViewDetails?: (locationId: string) => void;
}

export function LocationCard({ location, onBookNow, onViewDetails }: LocationCardProps) {
  const handleBookNow = () => {
    onBookNow?.(location.id || '');
  };

  const handleViewDetails = () => {
    onViewDetails?.(location.id || '');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {location.name}
        </CardTitle>
        <CardDescription>
          {location.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {location.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Capacity: {location.capacity}</span>
          </div>
          <Badge variant="secondary">Available</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{location.openTime} - {location.closeTime}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={handleViewDetails}
            variant="outline"
            className="flex-1"
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            onClick={handleBookNow}
            className="flex-1"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}