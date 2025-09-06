import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationFilters, LocationCategory, PriceRange } from '@/types/location';

interface LocationFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
  isLoading?: boolean;
}

const categoryOptions = [
  { value: LocationCategory.CONFERENCE_ROOM, label: 'Conference Room' },
  { value: LocationCategory.OFFICE_SPACE, label: 'Office Space' },
  { value: LocationCategory.EVENT_HALL, label: 'Event Hall' },
  { value: LocationCategory.COWORKING, label: 'Co-working' },
  { value: LocationCategory.MEETING_ROOM, label: 'Meeting Room' },
  { value: LocationCategory.STUDIO, label: 'Studio' },
  { value: LocationCategory.OTHER, label: 'Other' },
];

const priceRangeOptions = [
  { value: PriceRange.BUDGET, label: 'Budget ($)' },
  { value: PriceRange.MODERATE, label: 'Moderate ($$)' },
  { value: PriceRange.PREMIUM, label: 'Premium ($$$)' },
  { value: PriceRange.LUXURY, label: 'Luxury ($$$$)' },
];

const ratingOptions = [
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' },
];

export function LocationFilters({ 
  filters, 
  onFiltersChange, 
  isLoading = false 
}: LocationFiltersProps) {
  const updateFilters = (key: keyof LocationFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
    });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'searchQuery' && value !== undefined && value !== ''
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={filters.searchQuery || ''}
              onChange={(e) => updateFilters('searchQuery', e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => 
                  updateFilters('category', value === 'all' ? undefined : value as LocationCategory)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <Select
                value={filters.priceRange || 'any'}
                onValueChange={(value) => 
                  updateFilters('priceRange', value === 'any' ? undefined : value as PriceRange)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any price</SelectItem>
                  {priceRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input
                placeholder="Enter city"
                value={filters.city || ''}
                onChange={(e) => updateFilters('city', e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
              <Select
                value={filters.minRating?.toString() || 'any'}
                onValueChange={(value) => 
                  updateFilters('minRating', value === 'any' ? undefined : parseInt(value))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categoryOptions.find(c => c.value === filters.category)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters('category', undefined)}
                  />
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {priceRangeOptions.find(p => p.value === filters.priceRange)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters('priceRange', undefined)}
                  />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.city}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters('city', '')}
                  />
                </Badge>
              )}
              {filters.minRating && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.minRating}+ Stars
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters('minRating', undefined)}
                  />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 text-xs"
                disabled={isLoading}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}