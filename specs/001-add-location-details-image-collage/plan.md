
# Implementation Plan: Location Details Image Collage

**Branch**: `001-add-location-details-image-collage` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `D:\Repos\Portfolio-Booking\specs\001-add-location-details-image-collage\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Replace the single image display on the location details page with a dynamic image collage component that adapts layout based on image count (1-6+ images). Users can click images to open a full-screen lightbox with keyboard navigation. This is a **frontend-only** feature using the existing public Greece images (/greece1.jpg, /greece2.jpg, /greece3.jpg) to simulate multiple images per location.

## Technical Context
**Language/Version**: TypeScript 5.x with Next.js 15.5.2
**Primary Dependencies**: Next.js Image component, React 19.1, Tailwind CSS 4, Radix UI, Lucide React (icons), next-intl (i18n)
**Storage**: Frontend-only (use existing getImage() logic to generate array of image URLs from public/greece*.jpg)
**Testing**: React Testing Library, Jest (or Vitest), Playwright for E2E
**Target Platform**: Web browsers (mobile, tablet, desktop responsive)
**Project Type**: Web (frontend-only feature, no backend changes)
**Performance Goals**: Image optimization via Next.js Image, lazy loading, <2s initial load, smooth transitions
**Constraints**: Must work on mobile screens ≥320px width, keyboard accessible, WCAG 2.1 AA compliant
**Scale/Scope**: Single location details page component, 3-4 new React components (collage, lightbox, navigation)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 4: Frontend Component Architecture ✅ PASS
- **Server components by default**: ImageCollage component can be server component initially, lightbox will be client component for interactivity
- **Separation of concerns**: Component for UI (ImageCollage, Lightbox), custom hook for keyboard nav logic (useKeyboardNav), no new service layer needed (uses existing API)
- **TypeScript strict mode**: All new components will use TypeScript with proper typing
- **i18n support**: Toast messages and alt text will use next-intl for Dutch translations

### Principle 5: Testability First ✅ PASS
- **Unit tests**: Component tests for ImageCollage layout logic (1, 2, 3, 4+ image layouts)
- **Integration tests**: Lightbox interaction tests (open, close, navigate, keyboard)
- **E2E tests**: Full user flow on location details page
- **TDD approach**: Write failing tests for layout variations before implementing component logic

### Principle 6: API Contract Clarity ⚠️ REVIEW NEEDED
- This is primarily a frontend feature
- Backend Location entity needs imageUrls field added (array of strings)
- Existing GET /api/locations/{id} endpoint returns Location with new field
- **Question**: Do we need to modify backend API contract or can frontend handle empty array gracefully?
- **Decision**: Frontend will handle both old (single image via hash) and new (imageUrls array) formats for backwards compatibility

### Constitutional Compliance Summary
- ✅ **Principle 1 (Clean Architecture)**: N/A - frontend-only feature
- ✅ **Principle 2 (Domain-Centric Design)**: N/A - UI feature with no business logic
- ✅ **Principle 3 (Vertical Slice)**: N/A - backend not affected
- ✅ **Principle 4 (Frontend Architecture)**: Fully compliant
- ✅ **Principle 5 (Testability)**: Test-first approach planned
- ✅ **Principle 6 (API Clarity)**: Minor backend change, graceful degradation planned

**Initial Check Result**: PASS - No constitutional violations

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── components/
│   │   └── ui/            # Existing UI components (Button, Card, etc.)
│   ├── features/
│   │   └── locations/
│   │       ├── components/
│   │       │   ├── ImageCollage.tsx      # NEW: Main collage component
│   │       │   ├── Lightbox.tsx          # NEW: Full-screen image viewer
│   │       │   └── ImageNavigation.tsx   # NEW: Arrow navigation for collage
│   │       ├── hooks/
│   │       │   └── useKeyboardNav.ts     # NEW: Keyboard navigation logic
│   │       ├── utils/
│   │       │   └── getLocationImages.ts  # NEW: Generate image URLs from location ID
│   │       └── pages/
│   │           └── LocationDetailsPage.tsx  # MODIFIED: Use ImageCollage
│   ├── app/
│   │   └── locations/[id]/
│   │       └── page.tsx                  # Entry point (minimal changes)
│   └── i18n/
│       └── nl.json                       # MODIFIED: Add translations
└── __tests__/                            # NEW: Test directory
    └── features/
        └── locations/
            ├── ImageCollage.test.tsx
            ├── Lightbox.test.tsx
            └── LocationDetailsPage.test.tsx
```

**Structure Decision**: Web application structure (frontend-only feature). No backend changes required. Following the existing pattern of organizing features in `frontend/src/features/locations/`. Image URLs will be generated client-side using the existing getImage() hash logic extended to return an array of greece*.jpg images.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **From data-model.md**:
   - Frontend: Create getLocationImages() utility to generate image URLs [P]
   - Frontend: Create ImageCollage component [P]
   - Frontend: Create Lightbox component [P]
   - Frontend: Create ImageNavigation component [P]
   - Frontend: Create useKeyboardNav hook [P]
2. **From quickstart.md scenarios**:
   - Unit test: getLocationImages() generates correct array based on location ID
   - Integration test: Single image layout
   - Integration test: Two images side-by-side
   - Integration test: Three images masonry
   - Integration test: Four+ images grid
   - Integration test: Lightbox open/close/navigate
   - Integration test: Keyboard navigation
   - E2E test: Full user flow with Playwright
3. **Implementation tasks**:
   - Modify LocationDetailsPage to use ImageCollage
   - Add i18n translations for toast and lightbox
   - Add toast notification for image errors

**Ordering Strategy**:
- TDD order: All tests written before implementation
- Utility functions first (getLocationImages)
- Independent components marked [P] (ImageCollage, Lightbox, hooks can be built in parallel)
- Integration after unit tests
- E2E tests last

**Task Phases**:
1. **Setup** (T001-T002): Test setup, dependencies check
2. **Tests First** (T003-T012): All unit and integration tests (TDD)
3. **Frontend Components** (T013-T019): Utility, ImageCollage, Lightbox, hooks [P]
4. **Integration** (T020-T023): Wire components, i18n, error handling
5. **Polish** (T024-T025): E2E tests, accessibility audit

**Estimated Output**: 25-28 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
