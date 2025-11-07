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
 * Checks if a number is a valid LocationType enum value
 * @param value - The number to check
 * @returns true if valid, false otherwise
 */
export function isValidLocationType(value: number): value is LocationType {
  return Object.values(LocationType).includes(value);
}

/**
 * Converts a LocationType enum to a string for query parameters
 * @param type - The LocationType enum value
 * @returns String representation of the enum value
 */
export function locationTypeToQueryString(type: LocationType): string {
  return type.toString();
}

/**
 * Gets the display name for a LocationType
 * @param type - The LocationType enum value
 * @returns Human-readable name
 */
export function getLocationTypeDisplayName(type: LocationType): string {
  switch (type) {
    case LocationType.Hotel:
      return 'Hotel';
    case LocationType.BAndB:
      return 'B&B';
    case LocationType.None:
      return 'None';
    default:
      return 'Unknown';
  }
}
