# Quickstart: Location Details Image Collage

## Prerequisites

- Node.js 20+ installed
- Frontend development server running (`npm run dev`)
- Backend API running with Location endpoint available
- At least one test location with imageUrls populated

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Update Test Data (Backend)

Ensure at least one location has imageUrls populated for testing:

```csharp
// Example seed data or migration
var testLocation = new Location
{
    Id = "test-123",
    Name = "Test Villa",
    Address = "123 Test Street",
    Description = "A test location for image collage",
    Capacity = 50,
    OpenTime = "09:00",
    CloseTime = "22:00",
    ImageUrls = new List<string>
    {
        "/greece1.jpg",
        "/greece2.jpg",
        "/greece3.jpg",
        "/greece4.jpg"
    }
};
```

### 3. Start Development Servers

**Terminal 1 (Backend)**:
```bash
cd backend
dotnet run --project Booking.Api
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

## Manual Testing Scenarios

### Scenario 1: View Single Image

1. Navigate to a location with 1 image in imageUrls array
2. **Expected**: Single full-width image displayed
3. **Verify**: Image is responsive on mobile/tablet/desktop

**Test URL**: `http://localhost:3000/locations/{id-with-1-image}`

### Scenario 2: View Two Images

1. Navigate to a location with 2 images
2. **Expected**: Two images displayed side-by-side with equal width
3. **Verify**: Layout adapts to single column on mobile

**Test URL**: `http://localhost:3000/locations/{id-with-2-images}`

### Scenario 3: View Three Images (Masonry)

1. Navigate to a location with 3 images
2. **Expected**: Pinterest-style masonry layout
   - One large image on left
   - Two smaller stacked images on right
3. **Verify**: Layout is visually balanced

**Test URL**: `http://localhost:3000/locations/{id-with-3-images}`

### Scenario 4: View Four+ Images (Grid)

1. Navigate to a location with 4 or more images
2. **Expected**: 2x2 or larger grid layout
3. **Verify**: Grid wraps properly on smaller screens

**Test URL**: `http://localhost:3000/locations/{id-with-4plus-images}`

### Scenario 5: Lightbox Interaction

1. Navigate to any location with images
2. Click on any image in the collage
3. **Expected**: Full-screen lightbox opens showing clicked image
4. Click "Next" arrow or press Right Arrow key
5. **Expected**: Next image displays with smooth transition
6. Click "Previous" arrow or press Left Arrow key
7. **Expected**: Previous image displays
8. Press ESC key or click X button
9. **Expected**: Lightbox closes, returns to collage view

### Scenario 6: Keyboard Navigation

1. Open lightbox (click any image)
2. Press **Right Arrow** key multiple times
3. **Expected**: Cycles through all images, wraps to first after last
4. Press **Left Arrow** key multiple times
5. **Expected**: Cycles backward through images, wraps to last after first
6. Press **ESC** key
7. **Expected**: Lightbox closes

### Scenario 7: Empty Images (Placeholder)

1. Navigate to a location with null or empty imageUrls
2. **Expected**: Placeholder image displays (fallback to hash-based image)
3. **Verify**: No errors in console

**Test URL**: `http://localhost:3000/locations/{id-without-images}`

### Scenario 8: Image Load Failure

1. Navigate to a location with an invalid image URL in imageUrls
2. **Expected**: Toast notification appears: "Afbeelding laden mislukt"
3. **Verify**: Other valid images still display correctly

### Scenario 9: Navigation Arrows (6+ Images)

1. Navigate to a location with more than 6 images
2. **Expected**: Only first 6 images displayed in collage
3. **Verify**: Navigation arrows visible at bottom/sides
4. Click "Next" arrow
5. **Expected**: Next set of images (7-12) displays
6. Click "Previous" arrow
7. **Expected**: Previous set (1-6) displays

### Scenario 10: Accessibility

1. Use screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to location with images
3. **Expected**: Each image has descriptive alt text: "{Location Name} photo {number}"
4. Tab to lightbox controls
5. **Expected**: All buttons are keyboard accessible and have aria-labels
6. **Verify**: Focus is trapped within lightbox when open

### Scenario 11: Responsive Behavior

**Mobile (< 640px)**:
1. Open location page on mobile device or resize browser to 375px width
2. **Expected**: Collage adapts to single column, images stack vertically

**Tablet (640px - 1024px)**:
1. Resize to 768px width
2. **Expected**: 2-column grid maintains, images resize proportionally

**Desktop (> 1024px)**:
1. View on desktop resolution (1920px)
2. **Expected**: Grid layout with optimal spacing and sizing

### Scenario 12: Performance

1. Navigate to location with 6+ high-res images
2. Open DevTools → Network tab
3. **Expected**:
   - Images load progressively (lazy loading)
   - First image has `priority` (loads immediately)
   - WebP/AVIF format used when supported
   - Correct image size loaded based on viewport (check `sizes` attribute)

## Automated Test Execution

### Run Unit Tests

```bash
cd frontend
npm test -- --testPathPattern=ImageCollage
```

**Expected**: All tests pass
- Layout selection logic (1, 2, 3, 4+ images)
- Image URL sanitization
- Fallback to placeholder

### Run Integration Tests

```bash
npm test -- --testPathPattern=Lightbox
```

**Expected**: All tests pass
- Open/close lightbox
- Navigate next/previous
- Keyboard navigation
- Focus management

### Run E2E Tests

```bash
npx playwright test
```

**Expected**: All scenarios pass
- Full user flow from collage to lightbox
- Keyboard navigation
- Responsive breakpoints

## Success Criteria

- ✅ All 12 manual test scenarios pass
- ✅ All automated tests pass (unit, integration, E2E)
- ✅ No console errors or warnings
- ✅ Lighthouse accessibility score ≥ 90
- ✅ Images load in < 2 seconds on 3G connection
- ✅ Keyboard navigation works without mouse
- ✅ Screen reader announces all interactive elements correctly

## Troubleshooting

**Issue**: Images not displaying
- **Check**: Backend API returns imageUrls array in response
- **Check**: Image URLs are valid and accessible
- **Check**: CORS configured correctly if using external image host

**Issue**: Lightbox not opening
- **Check**: Browser console for JavaScript errors
- **Check**: Radix UI Dialog installed (`npm list @radix-ui/react-dialog`)

**Issue**: Keyboard navigation not working
- **Check**: Lightbox is focused (check document.activeElement)
- **Check**: useKeyboardNav hook is attached to correct events

**Issue**: Layout broken on mobile
- **Check**: Tailwind breakpoints configured correctly
- **Check**: Viewport meta tag present in HTML head

## Cleanup

```bash
# Stop servers
Ctrl+C in both terminals

# Optional: Clear test data
# Remove test locations from database if needed
```
