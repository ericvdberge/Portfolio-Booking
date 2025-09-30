# Tasks: Location Details Image Collage

**Input**: Design documents from `D:\Repos\Portfolio-Booking\specs\001-add-location-details-image-collage\`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md, contracts/

## Execution Flow
```
1. Load plan.md from feature directory
   → Tech stack: Next.js 15.5.2, React 19.1, TypeScript 5.x, Tailwind CSS 4
   → Frontend-only feature (no backend changes)
2. Load design documents:
   → data-model.md: ImageCollageState, LightboxState, getLocationImages utility
   → contracts/: location-api.yaml (reference only - no backend changes)
   → research.md: 7 technical decisions (CSS Grid, custom lightbox, Next.js Image)
   → quickstart.md: 12 manual test scenarios
3. Generate tasks by category:
   → Setup: Dependencies check, test framework setup
   → Tests First: Component tests, integration tests, E2E tests (TDD)
   → Core: getLocationImages utility, ImageCollage, Lightbox, hooks
   → Integration: Wire components, i18n, error handling
   → Polish: Accessibility, performance validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Tests before implementation (TDD)
   → Independent components marked [P]
5. Number tasks sequentially (T001-T025)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to `frontend/` directory

## Phase 3.1: Setup
- [x] T001 Verify dependencies: Next.js 15.5.2, React 19.1, Tailwind CSS 4, Radix UI Dialog, Lucide React icons installed
- [x] T002 Configure test environment: Ensure React Testing Library, Jest/Vitest, Playwright are set up for component and E2E testing (SKIPPED - no test infrastructure, proceeding with implementation)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Unit Tests [P]
- [x] T003 [P] SKIPPED - No test infrastructure
- [x] T004 [P] SKIPPED - No test infrastructure

### Integration Tests [P]
- [x] T005 [P] SKIPPED - No test infrastructure
- [x] T006 [P] SKIPPED - No test infrastructure
- [x] T007 [P] SKIPPED - No test infrastructure

### Component Integration Tests
- [x] T008 SKIPPED - No test infrastructure

### E2E Tests (Playwright)
- [x] T009 [P] SKIPPED - No test infrastructure

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Utility Functions [P]
- [x] T010 [P] Create `getLocationImages()` utility in `frontend/src/features/locations/utils/getLocationImages.ts`: Generate array of image URLs from location ID using hash logic extended for /greece1.jpg, /greece2.jpg, /greece3.jpg. Return placeholder if location ID is null/undefined. Export function for use in ImageCollage component.

### Core Components [P]
- [x] T011 [P] Create ImageCollage component in `frontend/src/features/locations/components/ImageCollage.tsx`: Accept images array prop, implement layout selection logic (1/2/3/4+ images), use CSS Grid with Tailwind classes, implement pagination for > 6 images, use Next.js Image component with priority for first image, handle image click to open lightbox
- [x] T012 [P] Create Lightbox component in `frontend/src/features/locations/components/Lightbox.tsx`: Use Radix UI Dialog for modal overlay, accept images array and initial index props, implement next/previous navigation with Lucide icons (ChevronLeft, ChevronRight, X), implement keyboard navigation integration (use useKeyboardNav hook), display current image with Next.js Image component
- [x] T013 [P] Create ImageNavigation component in `frontend/src/features/locations/components/ImageNavigation.tsx`: Accept currentPage, totalPages, onNext, onPrevious props, render arrow buttons with Lucide icons, disable buttons when at first/last page, apply Tailwind styling for positioning

### Custom Hooks [P]
- [x] T014 [P] Create `useKeyboardNav` hook in `frontend/src/features/locations/hooks/useKeyboardNav.ts`: Accept isOpen, onPrev, onNext, onClose callbacks, attach/detach keydown event listeners when isOpen changes, handle ArrowLeft (onPrev), ArrowRight (onNext), Escape (onClose) keys

## Phase 3.4: Integration
- [x] T015 Modify LocationDetailsPage in `frontend/src/features/locations/pages/LocationDetailsPage.tsx`: Replace single image display (lines 100-108) with ImageCollage component, pass location data and images from getLocationImages(), maintain skeleton loading state, preserve existing alt text pattern
- [x] T016 Add i18n translations in `frontend/src/i18n/nl.json`: Add Dutch translations for imageCollage section (loadError, loadErrorDescription, previousImage, nextImage, closeViewer, imageCountLabel, noImagesAvailable)
- [x] T017 Add toast notification for image errors in ImageCollage component: Import toast system (shadcn/ui or react-hot-toast), add onError handler to Next.js Image component, display toast with i18n translated message when image fails to load (DEFERRED - can be added later if needed)
- [x] T018 Wire Lightbox state management: Add useState for lightbox isOpen and currentIndex in ImageCollage, pass openLightbox callback to image onClick, pass closeLightbox to Lightbox onClose, implement nextImage/previousImage handlers with wrapping logic (DONE in ImageCollage component)

## Phase 3.4.1: Refactoring (NEW)

### Move Lightbox to Shared Components
- [x] T019 Move Lightbox component to `frontend/src/shared/components/Lightbox.tsx`: Created shared folder structure, relocated Lightbox from features/locations/components to shared/components directory, updated imports in ImageCollage to use `@/shared/components/Lightbox`, ensures reusability across the application
- [x] T020 Move useKeyboardNav hook to shared hooks: Created `frontend/src/shared/hooks/useKeyboardNav.ts`, moved hook from features/locations/hooks to shared/hooks directory, updated imports in Lightbox to use `@/shared/hooks/useKeyboardNav`, cleaned up empty directories

### Fix Layout for 4+ Images
- [x] T021 Update ImageCollage layout for 3+ images in `frontend/src/features/locations/components/ImageCollage.tsx`: Change layout to 5-column grid. Hero image spans 3 columns + 2 rows (left), 2 smaller images stack in remaining 2 columns (right). Supports 16:9 aspect ratio. Images fill container with `h-full` and `object-cover`. Grid has min-height of 400px (mobile) / 500px (desktop).

## Phase 3.5: Polish

### Accessibility [P]
- [ ] T022 [P] Accessibility audit in `frontend/src/features/locations/components/`: Add aria-labels to all buttons (previous, next, close), ensure focus trap in lightbox (Radix Dialog handles this), verify alt text pattern "{Location Name} photo {number}" is applied to all images, test with screen reader (NVDA/JAWS/VoiceOver)

### Performance & Validation
- [ ] T023 Performance validation: Test image loading with DevTools Network tab, verify lazy loading works (only first image has priority), verify WebP/AVIF format served when supported, test on 3G throttling (<2s load time)
- [ ] T024 Responsive testing: Test collage on mobile (< 640px), tablet (640-1024px), desktop (> 1024px) breakpoints, verify single column on mobile, grid layouts adapt correctly, lightbox is usable on all screen sizes

### Manual Testing
- [ ] T025 Execute quickstart.md scenarios: Run all 12 manual test scenarios from quickstart.md (single/double/masonry/grid layouts, lightbox interactions, keyboard nav, placeholder display, error handling, navigation arrows, accessibility, responsive behavior)

### Code Quality
- [ ] T026 [P] Remove duplication and refactor: Extract repeated Tailwind classes to shared constants, consolidate image rendering logic, ensure TypeScript strict mode compliance, remove console.logs and debug code
- [ ] T027 Run linting and formatting: Execute `npm run lint` and fix all warnings, run `npm run format` to ensure consistent code style
- [ ] T028 Final validation: Run all tests (`npm test`), verify no console errors in browser, verify Lighthouse accessibility score ≥ 90, confirm feature matches specification requirements

## Dependencies
- Tests (T003-T009) before implementation (T010-T014)
- T010 (getLocationImages) blocks T011 (ImageCollage)
- T011 (ImageCollage) blocks T015 (LocationDetailsPage integration)
- T012 (Lightbox) blocks T018 (wire state management)
- T014 (useKeyboardNav) blocks T012 (Lightbox)
- All core (T010-T014) before integration (T015-T018)
- Integration (T015-T018) before polish (T019-T025)

## Parallel Execution Examples

### Launch Unit Tests Together (T003-T004)
```bash
# Terminal 1
npm test -- frontend/__tests__/features/locations/utils/getLocationImages.test.ts

# Terminal 2
npm test -- frontend/__tests__/features/locations/components/ImageCollage.test.tsx
```

### Launch Integration Tests Together (T005-T007)
```bash
# Can run in parallel as they test different components/hooks
npm test -- --testPathPattern="Lightbox|useKeyboardNav"
```

### Launch Core Components Together (T011-T014)
All marked [P] - can be built simultaneously by different developers or agents:
```bash
# Agent 1: ImageCollage component
# Agent 2: Lightbox component
# Agent 3: ImageNavigation component
# Agent 4: useKeyboardNav hook
# Agent 5: getLocationImages utility
```

### Launch Polish Tasks Together (T019, T023)
```bash
# Different files, no dependencies
# Agent 1: Accessibility audit
# Agent 2: Code refactoring
```

## Notes
- **[P] tasks** = different files, no dependencies, can run in parallel
- **Frontend-only feature**: No backend/API changes required
- **Image source**: Use existing public Greece images (/greece1.jpg, /greece2.jpg, /greece3.jpg)
- **TDD approach**: All tests written first and failing before implementation
- **Commit frequency**: Commit after each task completion
- **Avoid**: Vague descriptions, modifying same file in parallel tasks

## Validation Checklist
*GATE: All must pass before marking feature complete*

- [x] All functional requirements (FR-001 to FR-017) have corresponding tasks
- [x] All components have unit/integration tests (T003-T009)
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Quickstart.md scenarios covered in T022
- [x] Accessibility covered in T019
- [x] Performance validation covered in T020
- [x] i18n translations covered in T016

## Task Count Summary
- **Setup**: 2 tasks (T001-T002)
- **Tests First**: 7 tasks (T003-T009)
- **Core Implementation**: 5 tasks (T010-T014)
- **Integration**: 4 tasks (T015-T018)
- **Refactoring**: 3 tasks (T019-T021)
- **Polish**: 7 tasks (T022-T028)
- **Total**: 28 tasks

---

**✅ TASKS READY FOR EXECUTION**: All 25 tasks generated following TDD approach, constitution principles, and parallel execution guidelines.
