# Image Gallery Components

Modular, reusable image gallery components for displaying images in both mobile carousel and desktop grid layouts.

## Components

### `ImageCollage` (Main Component)
High-level component that orchestrates mobile and desktop views with lightbox support.

```tsx
import { ImageCollage } from '@/features/locations/components/ImageCollage';

<ImageCollage
  images={images}
  locationName="Beach House"
  mobileConfig={{
    showDots: true,
    showCounter: true,
    showSwipeHint: true,
  }}
  desktopConfig={{
    imagesPerPage: 6,
  }}
/>
```

### `MobileCarousel`
Swipeable image carousel optimized for mobile devices.

```tsx
import { MobileCarousel } from '@/features/locations/components/image-gallery';

<MobileCarousel
  images={images}
  locationName="Beach House"
  onImageClick={(index) => console.log('Clicked image:', index)}
  showDots={true}
  showCounter={true}
  showSwipeHint={true}
  minHeight="min-h-[400px]"
/>
```

**Props:**
- `images`: Array of image URLs
- `locationName`: Name for alt text
- `onImageClick`: Callback when image is clicked
- `showDots`: Show dot indicators (default: true)
- `showCounter`: Show image counter badge (default: true)
- `showSwipeHint`: Show swipe hint text (default: true)
- `minHeight`: CSS class for minimum height (default: 'min-h-[400px]')

### `DesktopImageGrid`
Grid layout for desktop with hero image and pagination.

```tsx
import { DesktopImageGrid } from '@/features/locations/components/image-gallery';

<DesktopImageGrid
  images={images}
  locationName="Beach House"
  onImageClick={(index) => console.log('Clicked image:', index)}
  imagesPerPage={6}
  minHeight="min-h-[400px] md:min-h-[500px]"
/>
```

**Props:**
- `images`: Array of image URLs
- `locationName`: Name for alt text
- `onImageClick`: Callback when image is clicked
- `imagesPerPage`: Number of images per page (default: 6)
- `minHeight`: CSS class for minimum height

### Smaller UI Components

#### `DotIndicators`
Interactive dot navigation for carousels.

```tsx
import { DotIndicators } from '@/features/locations/components/image-gallery';

<DotIndicators
  total={5}
  currentIndex={2}
  onDotClick={(index) => setCurrentIndex(index)}
  className="mt-4"
/>
```

#### `ImageCounter`
Displays current image number and total count.

```tsx
import { ImageCounter } from '@/features/locations/components/image-gallery';

<ImageCounter
  current={3}
  total={5}
  className="absolute top-4 right-4"
/>
```

#### `SwipeHint`
Text hint for swipe gesture.

```tsx
import { SwipeHint } from '@/features/locations/components/image-gallery';

<SwipeHint show={hasMultipleImages} className="mt-2" />
```

## Usage Examples

### Custom Mobile-Only Carousel
```tsx
import { MobileCarousel } from '@/features/locations/components/image-gallery';

function CustomGallery() {
  const handleClick = (index: number) => {
    // Custom lightbox or action
  };

  return (
    <MobileCarousel
      images={myImages}
      locationName="Custom Location"
      onImageClick={handleClick}
      showDots={false}  // Hide dots
      showCounter={true}
      showSwipeHint={false}  // Hide hint
    />
  );
}
```

### Desktop Grid with Custom Pagination
```tsx
import { DesktopImageGrid } from '@/features/locations/components/image-gallery';

function CustomGrid() {
  return (
    <DesktopImageGrid
      images={myImages}
      locationName="Custom Location"
      onImageClick={(index) => console.log(index)}
      imagesPerPage={12}  // Show more images per page
    />
  );
}
```

### Build Your Own Gallery
```tsx
import {
  DotIndicators,
  ImageCounter,
  SwipeHint
} from '@/features/locations/components/image-gallery';

function CustomGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      {/* Your custom image display */}
      <ImageCounter current={currentIndex + 1} total={images.length} />
      <DotIndicators
        total={images.length}
        currentIndex={currentIndex}
        onDotClick={setCurrentIndex}
      />
      <SwipeHint show={images.length > 1} />
    </div>
  );
}
```

## File Structure

```
image-gallery/
├── index.ts                 # Exports all components
├── MobileCarousel.tsx       # Mobile swipeable carousel
├── DesktopImageGrid.tsx     # Desktop grid layout
├── DotIndicators.tsx        # Dot navigation UI
├── ImageCounter.tsx         # Image counter badge
├── SwipeHint.tsx            # Swipe hint text
└── README.md                # This file
```

## Features

- **Fully Modular**: Use individual components or the complete solution
- **Configurable**: Props for customizing behavior and appearance
- **Responsive**: Separate mobile and desktop experiences
- **Accessible**: ARIA labels and keyboard support
- **Touch Optimized**: Smooth swipe gestures on mobile
- **TypeScript**: Full type safety
