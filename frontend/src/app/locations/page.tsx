'use client';

import { useState, useEffect, useCallback } from 'react';
import { LocationFilters } from '@/components/locations/LocationFilters';
import { LocationList } from '@/components/locations/LocationList';
import { Location, LocationsResponse, LocationCategory, PriceRange } from '@/types/location';
import type { LocationFilters as ILocationFilters } from '@/types/location';

// Mock API function - replace with actual API call
const mockFetchLocations = async (filters: ILocationFilters): Promise<LocationsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Downtown Conference Center',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      description: 'Modern conference center with state-of-the-art facilities in the heart of downtown.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      amenities: ['wifi', 'coffee', 'parking', 'meeting'],
      category: LocationCategory.CONFERENCE_ROOM,
      priceRange: PriceRange.PREMIUM,
      rating: 4.5,
      reviewCount: 120,
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'info@dtcc.com',
        website: 'https://dtcc.com'
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Creative Studio Space',
      address: '456 Arts District',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      description: 'Bright and inspiring studio space perfect for creative teams and workshops.',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
      amenities: ['wifi', 'coffee', 'meeting'],
      category: LocationCategory.STUDIO,
      priceRange: PriceRange.MODERATE,
      rating: 4.2,
      reviewCount: 85,
      contactInfo: {
        phone: '+1 (555) 987-6543',
        email: 'hello@creativestudio.com'
      },
      isActive: true
    },
    {
      id: '3',
      name: 'Executive Meeting Room',
      address: '789 Corporate Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      description: 'Elegant executive meeting room with premium amenities for important business meetings.',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
      amenities: ['wifi', 'coffee', 'parking'],
      category: LocationCategory.MEETING_ROOM,
      priceRange: PriceRange.LUXURY,
      rating: 4.8,
      reviewCount: 200,
      contactInfo: {
        phone: '+1 (555) 456-7890',
        email: 'bookings@execroom.com'
      },
      isActive: true
    },
    {
      id: '4',
      name: 'Tech Hub Co-working',
      address: '321 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      description: 'Dynamic co-working space designed for tech startups and entrepreneurs.',
      imageUrl: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400',
      amenities: ['wifi', 'coffee', 'parking', 'meeting'],
      category: LocationCategory.COWORKING,
      priceRange: PriceRange.MODERATE,
      rating: 4.3,
      reviewCount: 150,
      contactInfo: {
        phone: '+1 (555) 234-5678',
        email: 'space@techhub.com',
        website: 'https://techhub.com'
      },
      isActive: true
    }
  ];

  // Apply filters
  let filteredLocations = [...mockLocations];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredLocations = filteredLocations.filter(location =>
      location.name.toLowerCase().includes(query) ||
      location.city.toLowerCase().includes(query) ||
      location.description?.toLowerCase().includes(query)
    );
  }

  if (filters.category) {
    filteredLocations = filteredLocations.filter(location =>
      location.category === filters.category
    );
  }

  if (filters.priceRange) {
    filteredLocations = filteredLocations.filter(location =>
      location.priceRange === filters.priceRange
    );
  }

  if (filters.city) {
    filteredLocations = filteredLocations.filter(location =>
      location.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters.minRating) {
    filteredLocations = filteredLocations.filter(location =>
      location.rating ? location.rating >= filters.minRating! : false
    );
  }

  return {
    locations: filteredLocations,
    total: filteredLocations.length,
    page: 1,
    limit: 20
  };
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<ILocationFilters>({
    searchQuery: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await mockFetchLocations(filters);
      setLocations(response.locations);
    } catch (err) {
      setError('Failed to fetch locations. Please try again.');
      console.error('Error fetching locations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleFiltersChange = (newFilters: ILocationFilters) => {
    setFilters(newFilters);
  };

  const handleBookNow = (locationId: string) => {
    // TODO: Implement booking functionality
    console.log('Book location:', locationId);
    alert(`Booking functionality for location ${locationId} will be implemented soon!`);
  };

  const handleViewDetails = (locationId: string) => {
    // TODO: Implement navigation to location details
    console.log('View details for location:', locationId);
    alert(`Location details for ${locationId} will be implemented soon!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Space</h1>
        <p className="text-muted-foreground">
          Discover and book amazing venues for your meetings, events, and workspace needs.
        </p>
      </div>

      <LocationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <LocationList
        locations={locations}
        isLoading={isLoading}
        // error={error}
        onBookNow={handleBookNow}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}