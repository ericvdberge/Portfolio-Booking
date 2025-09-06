export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description?: string;
  imageUrl?: string;
  amenities: string[];
  category: LocationCategory;
  priceRange: PriceRange;
  rating?: number;
  reviewCount?: number;
  availableTimeSlots?: TimeSlot[];
  contactInfo: ContactInfo;
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  date: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export enum LocationCategory {
  CONFERENCE_ROOM = 'conference_room',
  OFFICE_SPACE = 'office_space',
  EVENT_HALL = 'event_hall',
  COWORKING = 'coworking',
  MEETING_ROOM = 'meeting_room',
  STUDIO = 'studio',
  OTHER = 'other'
}

export enum PriceRange {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  PREMIUM = 'premium',
  LUXURY = 'luxury'
}

export interface LocationFilters {
  category?: LocationCategory;
  priceRange?: PriceRange;
  city?: string;
  amenities?: string[];
  minRating?: number;
  searchQuery?: string;
}

export interface LocationsResponse {
  locations: Location[];
  total: number;
  page: number;
  limit: number;
}