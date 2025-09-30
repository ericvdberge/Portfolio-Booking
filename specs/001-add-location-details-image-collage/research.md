# Research: Location Details Image Collage

## Technical Decisions

### Decision 1: Collage Layout Implementation

**Decision**: Use CSS Grid with dynamic template areas based on image count

**Rationale**:
- CSS Grid provides fine-grained control over layout without complex JavaScript
- `grid-template-columns` and `grid-template-rows` can be dynamically set via className
- Tailwind CSS 4 has excellent Grid utilities
- More performant than absolute positioning or flexbox for complex layouts
- Easier to make responsive with breakpoints

**Alternatives Considered**:
- **Masonry layout library** (e.g., react-masonry-css): Overkill for predetermined layouts (1-6 images)
- **Absolute positioning**: More complex to maintain, harder to make responsive
- **Flexbox**: Less control over 2D layouts compared to Grid

**Implementation Approach**:
```typescript
// Pseudo-code
const getGridClass = (imageCount: number) => {
  switch(imageCount) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-2'
    case 3: return 'grid-cols-2 grid-rows-2' // masonry: one tall, two stacked
    default: return 'grid-cols-2' // 2x2+ grid
  }
}
```

---

### Decision 2: Lightbox Component Choice

**Decision**: Build custom lightbox component instead of using a library

**Rationale**:
- Requirements are straightforward: full-screen image, prev/next navigation, ESC to close
- Most lightbox libraries are heavy (50-200kb) for simple needs
- Custom component ensures design consistency with existing UI
- Full control over keyboard navigation and accessibility
- Can leverage existing Radix UI primitives (Dialog) for modal behavior

**Alternatives Considered**:
- **yet-another-react-lightbox**: Feature-rich (145kb), but overkill for our needs
- **react-image-lightbox**: Older, not maintained, React 17
- **photoswipe**: Excellent but vanilla JS, integration overhead

**Implementation Approach**:
- Use Radix UI Dialog for modal overlay and focus management
- Custom navigation buttons with Lucide icons (ChevronLeft, ChevronRight, X)
- useEffect for keyboard event listeners (ArrowLeft, ArrowRight, Escape)
- CSS transforms for smooth image transitions

---

### Decision 3: Image Optimization Strategy

**Decision**: Use Next.js Image component with priority and sizes prop

**Rationale**:
- Next.js Image provides automatic optimization, lazy loading, and placeholder generation
- `priority` prop for above-the-fold images (first collage image)
- `sizes` prop ensures correct image size is loaded for each viewport
- Built-in support for WebP/AVIF when browser supports it
- Automatic srcset generation

**Configuration**:
```typescript
<Image
  src={imageUrl}
  alt={`${locationName} photo ${index + 1}`}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index === 0} // First image only
  className="object-cover w-full h-full"
/>
```

**Alternatives Considered**:
- **Native img tag**: No optimization, poor performance
- **react-lazy-load-image-component**: Redundant with Next.js Image

---

### Decision 4: State Management for Lightbox

**Decision**: Local component state (useState) with custom hook for keyboard nav

**Rationale**:
- Lightbox state is ephemeral and isolated to the component
- No need for global state (Redux, Zustand) for temporary UI state
- Custom hook (useKeyboardNav) keeps keyboard logic reusable and testable
- Simpler debugging and fewer dependencies

**Implementation**:
```typescript
const useKeyboardNav = (isOpen: boolean, onPrev: () => void, onNext: () => void, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);
};
```

---

### Decision 5: Backend Data Model Changes

**Decision**: Add `ImageUrls` property (List<string>) to Location entity, maintain backward compatibility

**Rationale**:
- Simple additive change, no breaking changes to existing API
- Frontend can handle both old format (single image via hash) and new format (ImageUrls array)
- Graceful degradation: if ImageUrls is null/empty, fall back to current getImage() logic
- Migration path: existing locations continue to work without data updates

**Schema Change**:
```csharp
public class Location : Entity
{
    // Existing properties...
    public List<string>? ImageUrls { get; set; } // Nullable for backward compat
}
```

**Frontend Handling**:
```typescript
const images = location.imageUrls?.length > 0
  ? location.imageUrls
  : [getImage()]; // Fallback to hash-based image
```

---

### Decision 6: Toast Notification for Image Load Failures

**Decision**: Use existing toast system (likely shadcn/ui toast or react-hot-toast)

**Rationale**:
- Project already uses Radix UI, likely has toast implementation
- Global toast pattern is standard for error notifications
- Consistent with existing error handling patterns in the app

**Implementation**:
```typescript
<Image
  src={imageUrl}
  onError={() => {
    toast.error(t('imageCollage.loadError'), {
      description: t('imageCollage.loadErrorDescription')
    });
  }}
  // ... other props
/>
```

---

### Decision 7: Responsive Breakpoints

**Decision**: Use Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

**Rationale**:
- Consistent with existing frontend styling
- Well-tested breakpoints for mobile-first design
- Collage adapts: mobile (1 col), tablet (2 col), desktop (grid layouts)

**Responsive Grid Classes**:
```typescript
// Example for 4 images
className="grid grid-cols-1 sm:grid-cols-2 gap-2"
```

---

## Summary

All research complete. No NEEDS CLARIFICATION remaining. Ready for Phase 1 (Design & Contracts).

**Key Takeaways**:
- Custom components preferred over heavy libraries for maintainability
- Next.js Image handles optimization out of the box
- CSS Grid provides elegant solution for adaptive layouts
- Backward compatibility ensured for backend changes
- Local state sufficient for isolated UI feature
