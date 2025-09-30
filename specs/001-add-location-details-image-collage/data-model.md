# Data Model: Location Details Image Collage

## Entities

### Location (Modified)

**Description**: Represents a bookable location/venue. Extended to support multiple images instead of single hash-based image.

**Fields**:
- `id`: string (existing) - Unique identifier
- `name`: string (existing) - Location name
- `address`: string (existing) - Physical address
- `description`: string (existing) - Location description
- `capacity`: number (existing) - Maximum occupancy
- `openTime`: string (existing) - Opening time
- `closeTime`: string (existing) - Closing time
- **`imageUrls`: string[] (NEW)** - Array of image URLs for the collage

**Validation Rules**:
- `imageUrls` is optional (nullable) for backward compatibility
- Each URL in `imageUrls` must be a valid HTTP/HTTPS URL or relative path
- Array can be empty (will trigger placeholder display)
- No maximum limit on array length (frontend handles overflow with navigation)

**State Transitions**: None (entity is read-only for this feature)

**Relationships**: None (Location is a root aggregate)

---

## Frontend Component State

### ImageCollage Component State

**Description**: Manages collage display and navigation

**State Shape**:
```typescript
interface ImageCollageState {
  images: string[];           // Processed image URLs
  currentPage: number;        // For pagination when > 6 images
  imagesPerPage: number;      // 6 images per page
}
```

**Computed Values**:
- `totalPages`: Math.ceil(images.length / imagesPerPage)
- `visibleImages`: images.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage)
- `layoutType`: 'single' | 'double' | 'masonry' | 'grid' (based on visibleImages.length)

---

### Lightbox Component State

**Description**: Manages full-screen image viewer

**State Shape**:
```typescript
interface LightboxState {
  isOpen: boolean;          // Lightbox visibility
  currentIndex: number;     // Currently displayed image index
  images: string[];         // All images for navigation
}
```

**Actions**:
- `openLightbox(index: number)`: Open lightbox at specific image
- `closeLightbox()`: Close lightbox
- `nextImage()`: Navigate to next image (wraps to first)
- `previousImage()`: Navigate to previous image (wraps to last)

---

## API Contract Changes

### GET /api/locations/{id}

**Response Schema (Modified)**:
```json
{
  "id": "string",
  "name": "string",
  "address": "string",
  "description": "string",
  "capacity": "number",
  "openTime": "string",
  "closeTime": "string",
  "imageUrls": ["string"] // NEW: Optional array of image URLs
}
```

**Backward Compatibility**:
- If `imageUrls` is null/undefined/empty, frontend falls back to existing `getImage()` hash logic
- Existing clients without `imageUrls` support continue to work
- New clients gracefully handle missing field

**Example Responses**:

**New format:**
```json
{
  "id": "abc123",
  "name": "Sunset Villa",
  "imageUrls": [
    "/images/sunset-villa-1.jpg",
    "/images/sunset-villa-2.jpg",
    "/images/sunset-villa-3.jpg"
  ]
}
```

**Legacy format (backward compat):**
```json
{
  "id": "abc123",
  "name": "Sunset Villa",
  "imageUrls": null
}
```

---

## Translation Keys (i18n)

**New keys for `nl.json`**:
```json
{
  "imageCollage": {
    "loadError": "Afbeelding laden mislukt",
    "loadErrorDescription": "Er is een probleem opgetreden bij het laden van een afbeelding",
    "previousImage": "Vorige afbeelding",
    "nextImage": "Volgende afbeelding",
    "closeViewer": "Sluiten",
    "imageCountLabel": "Afbeelding {current} van {total}",
    "noImagesAvailable": "Geen afbeeldingen beschikbaar"
  }
}
```

---

## Validation Summary

**Backend (C# Location Entity)**:
```csharp
public class Location : Entity
{
    // ... existing properties

    [MaxLength(100)] // Reasonable limit to prevent abuse
    public List<string>? ImageUrls { get; set; }
}
```

**Frontend (TypeScript)**:
```typescript
const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url, window.location.origin);
    return true;
  } catch {
    return false;
  }
};

const sanitizeImages = (imageUrls: string[] | null | undefined): string[] => {
  if (!imageUrls || imageUrls.length === 0) return [getImage()]; // Fallback
  return imageUrls.filter(validateImageUrl);
};
```

---

## Migration Notes

**Database Migration** (if using Entity Framework):
```csharp
public partial class AddImageUrlsToLocation : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "ImageUrls",
            table: "Locations",
            type: "nvarchar(max)", // JSON array stored as string
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ImageUrls",
            table: "Locations");
    }
}
```

**Data Seeding** (optional):
For existing locations, ImageUrls remains null. Admin UI can be added later to populate image arrays.

---

## Summary

- **1 entity modified**: Location (added ImageUrls property)
- **2 component states defined**: ImageCollage and Lightbox
- **1 API contract extended**: GET /api/locations/{id}
- **Backward compatibility**: Maintained via nullable ImageUrls and frontend fallback
- **Validation**: URL validation on frontend, length limit on backend
