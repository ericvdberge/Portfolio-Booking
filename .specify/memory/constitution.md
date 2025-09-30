<!--
SYNC IMPACT REPORT
Version: none → 1.0.0
Change Type: MINOR (Initial constitution creation)
Principles Added: 6 (Clean Architecture Separation, Domain-Centric Design, Vertical Slice Architecture, Frontend Component Architecture, Testability First, API Contract Clarity)
Templates Status:
  - ✅ spec-template.md: Aligned (no constitution-specific constraints needed)
  - ✅ plan-template.md: Contains Constitution Check placeholder - will be populated by /plan
  - ✅ tasks-template.md: Aligned (TDD principle matches Testability First)
Follow-up TODOs: None
-->

# Portfolio Booking System Development Constitution

**Version:** 1.0.0
**Ratified:** 2025-01-30
**Last Amended:** 2025-09-30

---

## Preamble

This constitution establishes the foundational principles and governance rules for the
Portfolio Booking System project. All development decisions, architecture choices, and
implementation practices MUST align with these principles.

---

## Core Principles

### Principle 1: Clean Architecture Separation

The system MUST maintain strict layer boundaries with dependencies flowing inward:
Api → Application → Domain ← Infrastructure.

**Rules:**
- Domain layer contains NO external dependencies (no frameworks, no databases, no HTTP)
- Application layer orchestrates use cases and commands/queries
- API layer handles HTTP concerns (routing, authentication, validation)
- Infrastructure layer implements data access, external integrations, and I/O

**Rationale:** Enforcing dependency inversion ensures the domain remains testable,
framework-agnostic, and focused on business logic. Changes to infrastructure or API
concerns do not ripple into domain code.

---

### Principle 2: Domain-Centric Design

Business logic MUST reside in rich domain entities, domain services, policies, and
specifications. Anemic domain models are prohibited.

**Rules:**
- Domain entities contain behavior, not just data
- Complex business rules encapsulated in testable Policy classes
  (e.g., `BookingCancellationPolicy`, `PricingPolicy`)
- Reusable business criteria implemented as Specification classes
  (e.g., `AvailableTimeSlotSpecification`, `ValidBookingSpecification`)
- Domain events communicate between bounded contexts for loose coupling
- No business logic in controllers, endpoints, or infrastructure

**Rationale:** Centralized business logic in domain objects makes rules explicit,
testable, and reusable. Policies and specifications provide clear extension points
and enable comprehensive unit testing of business rules.

---

### Principle 3: Vertical Slice Architecture

Application features MUST be organized by use case, not by technical layer.

**Rules:**
- Each feature operation has its own directory containing ALL related logic:
  command/query definition, handler, DTOs, validators, mappers
- Example structure:
  ```
  Features/Locations/GetAllLocations/GetAllLocations.cs
  Features/Bookings/CreateBooking/CreateBooking.cs
  ```
- Features are independently developable and deployable
- Cross-cutting concerns handled via interfaces, not shared service layers

**Rationale:** Feature-focused organization reduces cognitive load, minimizes coupling
between features, and enables parallel development. Changes to one feature rarely
impact others.

---

### Principle 4: Frontend Component Architecture

The Next.js frontend MUST follow component-based design with TypeScript and clear
separation of concerns.

**Rules:**
- Server components by default; client components ONLY when interactivity required
- API URL configured at build time via `NEXT_PUBLIC_API_URL` environment variable
- Separation of concerns:
  - Components handle UI rendering
  - Custom hooks encapsulate state management and side effects
  - Service modules handle API communication
- Internationalization (i18n) support with Dutch translations required
- TypeScript strict mode enabled for type safety

**Rationale:** Server-first rendering improves performance and SEO. Clear separation
between UI, logic, and API communication ensures maintainability and testability.
Build-time API configuration enables environment-specific deployments.

---

### Principle 5: Testability First

All business rules MUST be implemented as testable policies and specifications.
Test-driven development (TDD) is encouraged for complex business rules.

**Rules:**
- Unit tests for all domain logic (entities, policies, specifications)
- Integration tests for infrastructure concerns (database, external APIs)
- End-to-end tests for API contracts and critical user flows
- Contract tests for API endpoints MUST be written before implementation
- Tests MUST fail before implementation (red-green-refactor cycle)
- All tests MUST pass before merge

**Rationale:** Comprehensive testing ensures correctness, prevents regressions, and
documents expected behavior. Policies and specifications provide natural test seams
for isolating business logic.

---

### Principle 6: API Contract Clarity

The API MUST use Minimal APIs with endpoint-based routing following the IEndpoints
pattern. RESTful design for frontend consumption.

**Rules:**
- Each feature has a dedicated endpoint class (e.g., `BookingEndpoints`)
- Endpoints handle ONLY HTTP concerns: routing, authentication, authorization,
  request validation
- Endpoints map HTTP requests to application layer commands/queries
- No business logic in endpoints
- Clear request/response DTOs for API contracts
- OpenAPI documentation generated from endpoint definitions

**Rationale:** Separating HTTP handling from application logic keeps endpoints thin
and testable. Dedicated endpoint classes per feature align with vertical slice
architecture. RESTful conventions ensure frontend developers can predict API behavior.

---

## Governance

### Amendment Process

1. Propose changes via pull request with clear rationale
2. Review by project maintainers
3. Approval requires project lead sign-off
4. Version bump according to semantic versioning rules (see below)

### Versioning Policy

- **MAJOR:** Backward-incompatible principle removals or redefinitions
- **MINOR:** New principles added or material expansions to existing principles
- **PATCH:** Clarifications, wording fixes, non-semantic refinements

### Compliance Review

All feature specifications, design plans, and implementation tasks MUST be validated
against this constitution. Non-compliance blocks merge.

**Review checkpoints:**
1. **Specification phase:** Verify requirements align with principles
2. **Planning phase:** Constitution Check section in plan.md validates design
3. **Implementation phase:** Code review validates adherence to architecture rules
4. **Periodic audits:** Quarterly review of codebase for constitutional drift

---

## Enforcement

- **Pre-merge:** Architecture reviews validate alignment with all 6 principles
- **Post-merge:** Periodic audits ensure ongoing compliance
- **Violations:** Flagged in code review, documented as technical debt with
  remediation plan

---

## Technology Stack Context

**Backend:** ASP.NET Core with Minimal APIs, Entity Framework Core
**Frontend:** Next.js 14+ with TypeScript, React Server Components
**Deployment:** Docker containers, GitHub Actions CI/CD
**Patterns:** CQRS, DDD, Repository Pattern, Specification Pattern, Policy Pattern

---

*This constitution guides all technical and process decisions. When in doubt, refer
to these principles. All agents, developers, and reviewers MUST validate work against
this document.*
