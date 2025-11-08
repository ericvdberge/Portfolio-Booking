'use client';

import { useOrganization } from '@/contexts/OrganizationContext';
import { useGetDashboardLocations } from '@/api/dashboardLocations';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Button,
} from '@heroui/react';
import { MapPin, Users, Clock, Plus } from 'lucide-react';

export default function DashboardLocationsPage() {
  const { user } = useOrganization();

  // Use the generated API hook
  const { data: locations, isLoading, error } = useGetDashboardLocations(
    {
      headers: {
        'X-Organization-Id': user?.organizationId || '',
      },
    },
    {
      enabled: !!user?.organizationId, // Only fetch if we have an organizationId
    }
  );

  const getLocationTypeLabel = (type?: number) => {
    switch (type) {
      case 0:
        return 'None';
      case 1:
        return 'Hotel';
      case 2:
        return 'B&B';
      default:
        return 'Unknown';
    }
  };

  const getLocationTypeColor = (type?: number): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (type) {
      case 1:
        return 'primary';
      case 2:
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (!user?.organizationId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Locations</h1>
        </div>
        <Card shadow="sm">
          <CardBody className="p-6">
            <p className="text-danger">No organization selected. Please log in again.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading locations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Locations</h1>
        </div>
        <Card shadow="sm">
          <CardBody className="p-6">
            <p className="text-danger">
              Failed to load locations: {error.status === 401
                ? 'Unauthorized. Please check your organization access.'
                : error.payload || 'Unknown error'}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const locationsList = locations || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Locations</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {user?.organizationName} - {locationsList.length} location{locationsList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button color="primary" startContent={<Plus className="h-4 w-4" />}>
          Add Location
        </Button>
      </div>

      {/* Locations Grid */}
      {locationsList.length === 0 ? (
        <Card shadow="sm">
          <CardBody className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-default-300" />
            <h3 className="text-lg font-semibold mb-2">No locations yet</h3>
            <p className="text-default-500 mb-4">
              Get started by creating your first location
            </p>
            <Button color="primary" startContent={<Plus className="h-4 w-4" />}>
              Add Your First Location
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locationsList.map((location) => (
            <Card key={location.id} shadow="sm" isPressable className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-col items-start gap-2 p-4">
                <div className="flex items-start justify-between w-full">
                  <h3 className="text-lg font-semibold line-clamp-1">{location.name}</h3>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getLocationTypeColor(location.locationType)}
                  >
                    {getLocationTypeLabel(location.locationType)}
                  </Chip>
                </div>
                <div className="flex items-center gap-1 text-sm text-default-500">
                  <MapPin className="h-4 w-4" />
                  <p className="line-clamp-1">{location.address}</p>
                </div>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-0">
                <p className="text-sm text-default-600 line-clamp-2 mb-4">
                  {location.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-default-600">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {location.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-default-600">
                    <Clock className="h-4 w-4" />
                    <span>{location.openTime} - {location.closeTime}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={location.isActive ? 'success' : 'default'}
                  >
                    {location.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                  <Button size="sm" variant="flat" color="primary">
                    View Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
