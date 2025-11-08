import { components } from './api-types';

type LocationDto = components['schemas']['LocationDto'];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface FetchLocationsOptions {
  organizationId?: string;
  limit?: number;
  locationType?: number;
}

export async function fetchLocations(options?: FetchLocationsOptions): Promise<LocationDto[]> {
  const { organizationId, limit, locationType } = options || {};

  // Build query params
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (locationType !== undefined) params.append('locationType', locationType.toString());

  // Determine endpoint based on whether organizationId is provided
  const endpoint = organizationId
    ? '/api/dashboard/locations'
    : '/api/locations';

  const url = `${API_BASE_URL}${endpoint}${params.toString() ? `?${params}` : ''}`;

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add organization header if provided
  if (organizationId) {
    headers['X-Organization-Id'] = organizationId;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchLocationById(id: string): Promise<LocationDto> {
  const url = `${API_BASE_URL}/api/locations/${id}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error(`Failed to fetch location: ${response.statusText}`);
  }

  return response.json();
}
