import { LocationType } from '@/api/client';

/**
 * Converts a string query parameter to a LocationType enum value
 * @param value - The string value from query parameter
 * @returns LocationType enum value or null if invalid
 */
export function parseLocationTypeFromQuery(value: string | null): LocationType | null {
  if (value === null) return null;

  const numValue = parseInt(value, 10);

  // Check if the parsed number is a valid LocationType enum value
  if (isNaN(numValue) || !isValidLocationType(numValue)) {
    return null;
  }

  return numValue as LocationType;
}

/**
 * Builds a location page URL with optional type filter
 * @param type - The LocationType to filter by, or null for all locations
 * @returns The URL path with query parameter if type is specified
 */
export function buildLocationTypeUrl(type: LocationType | null): string {
  return type === null ? '/locations' : `/locations?type=${type}`;
}

/**
 * Checks if a number is a valid LocationType enum value
 * @param value - The number to check
 * @returns true if valid, false otherwise
 */
function isValidLocationType(value: number): value is LocationType {
  return Object.values(LocationType).includes(value);
}
